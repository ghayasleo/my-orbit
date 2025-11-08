import { useQuery } from "@tanstack/react-query";
import { expenseService } from "@/services/expense-service";

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: ["expense", id],
    queryFn: () => {
      if (!id) throw new Error("Expense ID is required");
      return expenseService.getExpenseById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
