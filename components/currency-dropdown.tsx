"use client";

import { useCurrency } from "@/hooks/use-currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function CurrencyDropdown() {
  const { currencies, currency } = useCurrency();

  return (
    <div className="space-y-2">
      <label htmlFor="currency" className="text-sm font-medium">
        Currency
      </label>
      <Select defaultValue={currency}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency, id) => (
            <SelectItem key={id} value={currency.code}>{currency.name} ({currency.code})</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CurrencyDropdown;
