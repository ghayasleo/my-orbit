import { createClient } from "@/lib/supabase/client";
import { TablesInsert } from "@/lib/supabase/_database";

export class ExpenseService {
  private supabase;

  constructor() {
    this.supabase = createClient();

    this.createExpense = this.createExpense.bind(this);
    this.getExpenses = this.getExpenses.bind(this);
    this.deleteExpense = this.deleteExpense.bind(this);
  }

  async createExpense(expense: TablesInsert<"expenses">) {
    const { data, error } = await this.supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getExpenses(userId: string) {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getExpenseById(id: string) {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateExpense(id: string, updates: Partial<TablesInsert<"expenses">>) {
    const { data, error } = await this.supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteExpense(id: string) {
    const { error } = await this.supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const expenseService = new ExpenseService();
