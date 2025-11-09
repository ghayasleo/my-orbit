-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create user_push_tokens table
CREATE TABLE IF NOT EXISTS user_push_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fcm_token TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fcm_token)
);

-- 3. Create user_notification_settings table
CREATE TABLE IF NOT EXISTS user_notification_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  reminder_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Update reminders table (add notification_sent if not exists)
ALTER TABLE reminders
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false;

-- 5. Enable RLS and create policies
ALTER TABLE user_push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own push tokens" ON user_push_tokens;
CREATE POLICY "Users can manage their own push tokens"
ON user_push_tokens FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own notification settings" ON user_notification_settings;
CREATE POLICY "Users can manage their own notification settings"
ON user_notification_settings FOR ALL USING (auth.uid() = user_id);

-- 6. Create the main function to check due reminders (IMPROVED VERSION)
CREATE OR REPLACE FUNCTION check_and_notify_due_reminders()
RETURNS void AS $$
DECLARE
    due_reminder RECORD;
    user_settings BOOLEAN;
    processed_count INTEGER := 0;
    notify_count INTEGER := 0;
BEGIN
    RAISE NOTICE '=== CRON JOB STARTED at % ===', NOW();

    -- Process due reminders with limit to prevent timeout
    FOR due_reminder IN
        SELECT
            r.id as reminder_id,
            r.user_id,
            r.title,
            r.description
        FROM reminders r
        WHERE NOT r.is_completed
            AND NOT r.notification_sent
            AND (r.due_date || ' ' || COALESCE(r.due_time, '00:00:00'))::timestamp <= NOW()
            AND r.user_id IS NOT NULL
        LIMIT 50  -- Prevent timeout with too many reminders
    LOOP
        BEGIN
            processed_count := processed_count + 1;
            RAISE NOTICE 'Processing reminder: % for user %', due_reminder.title, due_reminder.user_id;

            -- Check if user has notifications enabled
            SELECT enabled INTO user_settings
            FROM user_notification_settings
            WHERE user_id = due_reminder.user_id;

            -- Only notify if user has notifications enabled (or no settings exist)
            IF user_settings IS NULL OR user_settings = true THEN
                -- Send notification via PostgreSQL NOTIFY
                PERFORM pg_notify(
                    'due_reminder',
                    json_build_object(
                        'reminder_id', due_reminder.reminder_id,
                        'user_id', due_reminder.user_id,
                        'title', due_reminder.title,
                        'description', due_reminder.description
                    )::text
                );

                notify_count := notify_count + 1;
                RAISE NOTICE '✅ NOTIFY sent for reminder: %', due_reminder.title;
            ELSE
                RAISE NOTICE '⚠️ Notifications disabled for user %, skipping', due_reminder.user_id;
            END IF;

            -- Mark as notified
            UPDATE reminders
            SET notification_sent = true
            WHERE id = due_reminder.reminder_id;

            RAISE NOTICE '📝 Marked reminder % as notified', due_reminder.reminder_id;

        EXCEPTION
            WHEN others THEN
                RAISE NOTICE '❌ Error processing reminder %: %', due_reminder.reminder_id, SQLERRM;
        END;
    END LOOP;

    -- Final summary
    IF processed_count = 0 THEN
        RAISE NOTICE 'ℹ️ No due reminders found';
    ELSE
        RAISE NOTICE '=== CRON JOB COMPLETED: Processed %, Notifications sent % ===', processed_count, notify_count;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Schedule the cron job (WITH CHECK FOR EXISTING JOB)
DO $$
BEGIN
    -- Unschedule if already exists
    PERFORM cron.unschedule('reminder-notification-checker')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'reminder-notification-checker');

    -- Schedule the job
    PERFORM cron.schedule(
        'reminder-notification-checker',
        '* * * * *', -- Every minute
        'SELECT check_and_notify_due_reminders()'
    );

    RAISE NOTICE '✅ Cron job scheduled successfully';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE '❌ Error scheduling cron job: %', SQLERRM;
END $$;

-- 8. Verify the job was created
SELECT jobid, jobname, schedule, command FROM cron.job;