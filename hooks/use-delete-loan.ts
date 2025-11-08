import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanService } from "@/services/loan-service";
import { toast } from "sonner";

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loanService.deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      toast.success("Loan deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting loan:", error);
      toast.error("Failed to delete loan");
    },
  });
}
