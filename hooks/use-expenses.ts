import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense-service";
import { useUser } from "./use-user";

export function useExpenses() {
  const { user, isLoading: userLoading } = useUser();

  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return expenseService.getExpenses(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    expenses,
    isLoading: userLoading || isLoading,
    error,
  };
}