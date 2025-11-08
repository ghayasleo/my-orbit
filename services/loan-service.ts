import { createClient } from '@/lib/supabase/client';
import { TablesInsert } from '@/lib/supabase/_database';

export class LoanService {
  private supabase = createClient();

  async createLoan(loan: TablesInsert<'loans'>) {
    const { data, error } = await this.supabase
      .from('loans')
      .insert(loan)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getLoans(userId: string) {
    const { data, error } = await this.supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getLoansByDirection(userId: string, direction: 'lending' | 'borrowing') {
    const { data, error } = await this.supabase
      .from('loans')
      .select('*')
      .eq('user_id', userId)
      .eq('direction', direction)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateLoan(id: string, updates: Partial<TablesInsert<'loans'>>) {
    const { data, error } = await this.supabase
      .from('loans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteLoan(id: string) {
    const { error } = await this.supabase
      .from('loans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const loanService = new LoanService();