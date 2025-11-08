"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userCurrency from "@/services/query/user-currency";
import updateCurrency from "@/services/mutation/update-currency";
import currencies from "@/lib/currencies";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export function useCurrency() {
  const queryClient = useQueryClient();

  const { data: currency = "USD", isLoading } = useQuery({
    queryKey: ["user-currency"],
    queryFn: userCurrency,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const updateCurrencyMutation = useMutation({
    mutationFn: updateCurrency,
    onMutate: async (newCurrency: string) => {
      await queryClient.cancelQueries({ queryKey: ["user-currency"] });
      const previousCurrency = queryClient.getQueryData(["user-currency"]);
      queryClient.setQueryData(["user-currency"], newCurrency);
      return { previousCurrency };
    },
    onError: (err, newCurrency, context) => {
      queryClient.setQueryData(["user-currency"], context?.previousCurrency);
      console.error("Error updating currency:", err);
    },
    onSuccess: () => {
      window.dispatchEvent(new Event("currency-changed"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-currency"] });
    },
  });

  const onChange = async (newCurrency: string) => {
    return updateCurrencyMutation.mutateAsync(newCurrency);
  };

  const getCurrencySymbol = (code?: string) => {
    const currencyCode = code || currency;
    const currencyInfo = getCurrencyByCode(currencyCode);
    return currencyInfo?.symbol || currencyCode;
  };

  const getCurrencyInfo = (code?: string): Currency => {
    const currencyCode = code || currency;
    const currencyObj = getCurrencyByCode(currencyCode);

    if (currencyObj) {
      return currencyObj;
    }

    return getCurrencyByCode("USD")!;
  };

  const getCurrencyByCode = (code: string): Currency | null => {
    return currencies.find(c => c.code === code) || null;
  };

  return {
    currency,
    setCurrency: onChange,
    getCurrencySymbol,
    getCurrencyInfo,
    currencies,
    isLoading: isLoading || updateCurrencyMutation.isPending,
    isUpdating: updateCurrencyMutation.isPending,
  };
}
