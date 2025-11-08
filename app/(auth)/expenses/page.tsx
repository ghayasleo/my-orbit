"use client";

import { useState } from "react";
import Header from "@/components/header";
import { CRUD, expensesBreadcrumb, expensesPage } from "@/constants/pages";
import { DataTable } from "@/components/data-table";
import { expenseColumns } from "@/constants/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useExpenses } from "@/hooks/use-expenses";
import { useCurrency } from "@/hooks/use-currency";

export default function ExpensesPage() {
  const { currency } = useCurrency();
  const { expenses, isLoading, error } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses?.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <main id="main">
        <Header breadcrumbs={expensesBreadcrumb} />
        <div className="px-4 py-6">
          <div className="text-center text-destructive">
            Error loading expenses: {error.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main">
      <Header breadcrumbs={expensesBreadcrumb} />

      <div className="px-4 py-6">
        <div className="space-y-6">
          {/* Header with Search and Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button asChild>
              <Link href={`${expensesPage.url}/${CRUD.CREATE}`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Expense
              </Link>
            </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-lg border">
            <DataTable
              columns={expenseColumns}
              data={filteredExpenses}
              meta={{ currency }}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading expenses...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm ? "No expenses found matching your search." : "No expenses yet."}
              </div>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link href={`${expensesPage.url}/${CRUD.CREATE}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Expense
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}