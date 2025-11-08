import { createClient } from "@/lib/supabase/client";
import { TablesInsert } from "@/lib/supabase/_database";

export class ReminderService {
  private supabase;

  constructor() {
    this.supabase = createClient();

    this.createReminder = this.createReminder.bind(this);
    this.getReminders = this.getReminders.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
  }

  async createReminder(reminder: TablesInsert<"reminders">) {
    const { data, error } = await this.supabase
      .from("reminders")
      .insert(reminder)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReminders(userId: string) {
    const { data, error } = await this.supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getReminderById(id: string) {
    const { data, error } = await this.supabase
      .from("reminders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateReminder(
    id: string,
    updates: Partial<TablesInsert<"reminders">>,
  ) {
    const { data, error } = await this.supabase
      .from("reminders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReminder(id: string) {
    const { error } = await this.supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const reminderService = new ReminderService();
