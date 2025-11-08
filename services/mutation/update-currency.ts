import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const updateCurrency = async (newCurrency: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  const { error } = await supabase.auth.updateUser({
    data: { currency: newCurrency },
  });
  if (error) throw error;
  localStorage.setItem("user-currency", newCurrency);
  return newCurrency;
};

export default updateCurrency;
