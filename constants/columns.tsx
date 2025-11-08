import { Database } from "@/lib/supabase/_database";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { ReminderActions } from "@/components/reminder-action";
import { ExpenseActions } from "@/components/expense-action";
import { LoanActions } from "@/components/loan-action";

export const reminderColumns: ColumnDef<
  Database["public"]["Tables"]["reminders"]["Row"]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("due_date") as string;
      return format(new Date(dueDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "due_time",
    header: "Time",
    cell: ({ row }) => {
      const dueTime = row.getValue("due_time") as string | null;
      return dueTime ? dueTime : "-";
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const variant =
        priority === "high"
          ? "destructive"
          : priority === "medium"
          ? "default"
          : priority === "low"
          ? "secondary"
          : "outline";

      return (
        <Badge variant={variant} className="capitalize">
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "recurrence",
    header: "Recurrence",
    cell: ({ row }) => {
      const recurrence = row.getValue("recurrence") as string;
      return recurrence !== "none" ? (
        <Badge variant="outline" className="capitalize">
          {recurrence}
        </Badge>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "is_completed",
    header: "Status",
    cell: ({ row }) => {
      const isCompleted = row.getValue("is_completed") as boolean;
      return (
        <Badge variant={isCompleted ? "default" : "secondary"}>
          {isCompleted ? "Completed" : "Pending"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ReminderActions reminder={row.original} />,
  },
];

export const expenseColumns: ColumnDef<
  Database["public"]["Tables"]["expenses"]["Row"]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("amount"));
      const meta = table.options.meta as { currency: string };

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: meta.currency,
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryColors: Record<string, string> = {
        food: "bg-green-100 text-green-800",
        transport: "bg-blue-100 text-blue-800",
        shopping: "bg-purple-100 text-purple-800",
        entertainment: "bg-pink-100 text-pink-800",
        bills: "bg-orange-100 text-orange-800",
        healthcare: "bg-red-100 text-red-800",
        other: "bg-gray-100 text-gray-800",
      };

      const colorClass = categoryColors[category] || categoryColors.other;

      return (
        <Badge variant="secondary" className={`capitalize ${colorClass}`}>
          {category.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return format(new Date(date), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ExpenseActions expense={row.original} />,
  },
];

export const loanColumns: ColumnDef<
  Database["public"]["Tables"]["loans"]["Row"]
>[] = [
  {
    accessorKey: "counterparty",
    header: "Counterparty",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("counterparty")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row, table }) => {
      const amount = parseFloat(row.getValue("amount"));
      const direction = row.original.direction;
      const meta = table.options.meta as { currency: string };

      return (
        <div
          className={`font-medium ${
            direction === "lending" ? "text-green-600" : "text-red-600"
          }`}
        >
          {direction === "lending" ? "+" : "-"}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: meta.currency,
          }).format(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "direction",
    header: "Type",
    cell: ({ row }) => {
      const direction = row.getValue("direction") as string;
      const isLending = direction === "lending";

      return (
        <Badge
          variant={isLending ? "default" : "secondary"}
          className="flex items-center gap-1"
        >
          {isLending ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownLeft className="h-3 w-3" />
          )}
          {isLending ? "Lending" : "Borrowing"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return format(new Date(date), "MMM dd, yyyy");
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status = "Active";
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";

      if (diffDays > 30) {
        status = "Overdue";
        variant = "destructive";
      } else if (diffDays > 7) {
        status = "Pending";
        variant = "outline";
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <LoanActions loan={row.original} />,
  },
];
