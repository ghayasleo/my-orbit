import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { currencyService } from "@/services/currency-service";

export function useCurrency() {
  const queryClient = useQueryClient();

  const { data: currency = "USD", isLoading } = useQuery({
    queryKey: ["user-currency"],
    queryFn: currencyService.getUserCurrency,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateCurrencyMutation = useMutation({
    mutationFn: currencyService.updateUserCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-currency"] });
      window.dispatchEvent(new Event("currency-changed"));
    },
  });

  return {
    currency,
    currencies: currencyService.getAvailableCurrencies(),
    setCurrency: updateCurrencyMutation.mutateAsync,
    isLoading: isLoading || updateCurrencyMutation.isPending,
    isUpdating: updateCurrencyMutation.isPending,
  };
}