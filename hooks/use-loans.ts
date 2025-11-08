import { useQuery } from "@tanstack/react-query";
import { loanService } from "@/services/loan-service";
import { useUser } from "./use-user";

export function useLoans() {
  const { user, isLoading: userLoading } = useUser();

  const {
    data: loans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["loans", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return loanService.getLoans(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    loans,
    isLoading: userLoading || isLoading,
    error,
  };
}