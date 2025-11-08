"use client";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import Header from "@/components/header";
import { createCrudBreadcrumb, CRUD, expensesPage } from "@/constants/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { expenseService } from "@/services/expense-service";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useExpense } from "@/hooks/use-expense";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  category: yup.string().required("Category is required"),
  date: yup.date().required("Date is required"),
  notes: yup.string(),
});

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  const expenseId = params.id as string;
  const { data: expense, isLoading, error } = useExpense(expenseId);

  const formik = useFormik({
    initialValues: {
      title: "",
      amount: "",
      category: "",
      date: null as Date | null,
      notes: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!user || !expense) return;

      try {
        const expenseData = {
          title: values.title,
          amount: parseFloat(values.amount),
          category: values.category,
          date: values.date!.toISOString().split("T")[0],
          notes: values.notes || null,
        };

        await expenseService.updateExpense(expense.id, expenseData);

        toast.success("Expense updated successfully");
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["expense", expenseId] });
        router.push(expensesPage.url);
      } catch (error) {
        console.error("Error updating expense:", error);
        toast.error("Failed to update expense");
      }
    },
  });

  useEffect(() => {
    if (expense) {
      formik.setValues({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: new Date(expense.date),
        notes: expense.notes || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load expense");
      router.push(expensesPage.url);
    }
  }, [error, router]);

  const handleDateSelect = (date: Date | undefined) => {
    formik.setFieldValue("date", date || null);
  };

  if (userLoading || isLoading) {
    return (
      <main id="main">
        <Header breadcrumbs={createCrudBreadcrumb(expensesPage, CRUD.UPDATE)} />
        <div className="px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!expense) {
    return (
      <main id="main">
        <Header breadcrumbs={createCrudBreadcrumb(expensesPage, CRUD.UPDATE)} />
        <div className="px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">Expense not found</div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main id="main">
      <Header breadcrumbs={createCrudBreadcrumb(expensesPage, CRUD.UPDATE)} />

      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Expense</CardTitle>
            <CardDescription>Update your expense details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="What was it spent for..."
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.title &&
                          formik.errors.title &&
                          "border-destructive"
                      )}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-sm text-destructive">
                        {formik.errors.title}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount *
                    </label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formik.values.amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.amount &&
                          formik.errors.amount &&
                          "border-destructive"
                      )}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <p className="text-sm text-destructive">
                        {formik.errors.amount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(value) =>
                        formik.setFieldValue("category", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Dining</SelectItem>
                        <SelectItem value="transport">
                          Transportation
                        </SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="bills">Bills & Utilities</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-sm text-destructive">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formik.values.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formik.values.date
                            ? format(formik.values.date, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formik.values.date || undefined}
                          onSelect={handleDateSelect}
                        />
                      </PopoverContent>
                    </Popover>
                    {formik.touched.date && formik.errors.date && (
                      <p className="text-sm text-destructive">
                        {formik.errors.date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2 flex-1 flex flex-col col-span-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    className="flex-1"
                    id="notes"
                    name="notes"
                    placeholder="Additional notes..."
                    rows={3}
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 w-fit ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={formik.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting || !user}
                >
                  {formik.isSubmitting ? "Updating..." : "Update Expense"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
