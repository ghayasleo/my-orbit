-- Enable RLS (if not already enabled)
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can manage own notification settings" ON user_notification_settings;

-- Create policy for SELECT (reading)
CREATE POLICY "Users can view own notification settings"
ON user_notification_settings
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for INSERT (creating)
CREATE POLICY "Users can create own notification settings"
ON user_notification_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE (modifying)
CREATE POLICY "Users can update own notification settings"
ON user_notification_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for DELETE (removing)
CREATE POLICY "Users can delete own notification settings"
ON user_notification_settings
FOR DELETE
USING (auth.uid() = user_id);