import { createClient } from "@/lib/supabase/client";
import { TablesInsert } from "@/lib/supabase/_database";

export class LoanService {
  private supabase;

  constructor() {
    this.supabase = createClient();

    this.createLoan = this.createLoan.bind(this);
    this.getLoans = this.getLoans.bind(this);
    this.deleteLoan = this.deleteLoan.bind(this);
  }

  async createLoan(loan: TablesInsert<"loans">) {
    const { data, error } = await this.supabase
      .from("loans")
      .insert(loan)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLoans(userId: string) {
    const { data, error } = await this.supabase
      .from("loans")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  }

  async getLoanById(id: string) {
    const { data, error } = await this.supabase
      .from("loans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async getLoansByDirection(
    userId: string,
    direction: "lending" | "borrowing",
  ) {
    const { data, error } = await this.supabase
      .from("loans")
      .select("*")
      .eq("user_id", userId)
      .eq("direction", direction)
      .order("date", { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateLoan(id: string, updates: Partial<TablesInsert<"loans">>) {
    const { data, error } = await this.supabase
      .from("loans")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteLoan(id: string) {
    const { error } = await this.supabase
      .from("loans")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async getLoansSummary(userId: string) {
    const loans = await this.getLoans(userId);

    const totalLent = loans
      .filter((loan) => loan.direction === "lending")
      .reduce((sum, loan) => sum + loan.amount, 0);

    const totalBorrowed = loans
      .filter((loan) => loan.direction === "borrowing")
      .reduce((sum, loan) => sum + loan.amount, 0);

    const netAmount = totalLent - totalBorrowed;

    return {
      totalLent,
      totalBorrowed,
      netAmount,
      totalLoans: loans.length,
    };
  }

  async getRecentLoans(userId: string, limit: number = 5) {
    const loans = await this.getLoans(userId);
    return loans
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
}

export const loanService = new LoanService();
