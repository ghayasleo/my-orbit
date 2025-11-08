import { createClient } from "@/lib/supabase/client";
import currencies from "@/lib/currencies";

const supabase = createClient();

export class CurrencyService {
  async getUserCurrency(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userCurrency = user.user_metadata?.currency;
        if (userCurrency) {
          localStorage.setItem("user-currency", userCurrency);
          return userCurrency;
        }
      }
      const savedCurrency = localStorage.getItem("user-currency");
      if (savedCurrency && currencies.some((c) => c.code === savedCurrency)) return savedCurrency;
      return "USD";
    } catch (error) {
      console.error("Error loading user currency:", error);
      return "USD";
    }
  }

  async updateUserCurrency(newCurrency: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    const { error } = await supabase.auth.updateUser({
      data: { currency: newCurrency },
    });
    if (error) throw error;
    localStorage.setItem("user-currency", newCurrency);
    return newCurrency;
  }

  async validateCurrency(currencyCode: string): Promise<boolean> {
    return currencies.some((c) => c.code === currencyCode);
  }

  getAvailableCurrencies() {
    return currencies;
  }

  async syncCurrencyWithLocalStorage(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userCurrency = user.user_metadata?.currency;
        if (userCurrency) localStorage.setItem("user-currency", userCurrency);
      }
    } catch (error) {
      console.error("Error syncing currency:", error);
    }
  }
}

export const currencyService = new CurrencyService();
