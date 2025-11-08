"use client";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import Header from "@/components/header";
import { createCrudBreadcrumb, CRUD, loansPage } from "@/constants/pages";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loanService } from "@/services/loan-service";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const validationSchema = yup.object({
  direction: yup
    .string()
    .oneOf(["lending", "borrowing"])
    .required("Direction is required"),
  amount: yup
    .number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: yup.date().required("Date is required"),
  counterparty: yup.string().required("Counterparty is required"),
  notes: yup.string(),
});

export default function CreateLoanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading: userLoading } = useUser();

  const formik = useFormik({
    initialValues: {
      direction: "",
      amount: "",
      date: null as Date | null,
      counterparty: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!user) {
        toast.error("You must be logged in to create a loan");
        return;
      }

      try {
        const loanData = {
          direction: values.direction as "lending" | "borrowing",
          amount: parseFloat(values.amount),
          date: values.date!.toISOString().split("T")[0],
          counterparty: values.counterparty,
          notes: values.notes || null,
          user_id: user.id,
        };

        await loanService.createLoan(loanData);

        toast.success("Loan created successfully");
        queryClient.invalidateQueries({ queryKey: ["loans"] });
        router.push(loansPage.url);
      } catch (error) {
        console.error("Error creating loan:", error);
        toast.error("Failed to create loan");
      }
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    formik.setFieldValue("date", date || null);
  };

  if (userLoading) {
    return (
      <main id="main">
        <Header breadcrumbs={createCrudBreadcrumb(loansPage, CRUD.CREATE)} />
        <div className="px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main id="main">
      <Header breadcrumbs={createCrudBreadcrumb(loansPage, CRUD.CREATE)} />

      <div className="px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Loan</CardTitle>
            <CardDescription>
              Add a new loan to track your lending or borrowing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="direction" className="text-sm font-medium">
                      Direction *
                    </label>
                    <Select
                      value={formik.values.direction}
                      onValueChange={(value) =>
                        formik.setFieldValue("direction", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Lending or borrowing?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lending">
                          I&apos;m Lending Money
                        </SelectItem>
                        <SelectItem value="borrowing">
                          I&apos;m Borrowing Money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.direction && formik.errors.direction && (
                      <p className="text-sm text-destructive">
                        {formik.errors.direction}
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

                  <div className="space-y-2">
                    <label
                      htmlFor="counterparty"
                      className="text-sm font-medium"
                    >
                      Counterparty *
                    </label>
                    <Input
                      id="counterparty"
                      name="counterparty"
                      placeholder="Person or institution name"
                      value={formik.values.counterparty}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        formik.touched.counterparty &&
                          formik.errors.counterparty &&
                          "border-destructive"
                      )}
                    />
                    {formik.touched.counterparty &&
                      formik.errors.counterparty && (
                        <p className="text-sm text-destructive">
                          {formik.errors.counterparty}
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
                  {formik.isSubmitting ? "Creating..." : "Create Loan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
