import { useQuery } from "@tanstack/react-query";
import { loanService } from "@/services/loan-service";

export function useLoan(id: string | undefined) {
  return useQuery({
    queryKey: ["loan", id],
    queryFn: () => {
      if (!id) throw new Error("Loan ID is required");
      return loanService.getLoanById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
