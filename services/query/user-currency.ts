import currencies from "@/lib/currencies";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const userCurrency = async () => {
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
    if (savedCurrency && currencies.some((c) => c.code === savedCurrency)) {
      return savedCurrency;
    }
    return "USD";
  } catch (error) {
    console.error("Error loading user currency:", error);
    return "USD";
  }
};

export default userCurrency;