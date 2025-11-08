import { Database } from "@/lib/supabase/_database";
import { ColumnDef } from "@tanstack/react-table";

export const expenseColumns: ColumnDef<
  Database["public"]["Tables"]["expenses"]["Row"]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

export const reminderColumns: ColumnDef<
  Database["public"]["Tables"]["reminders"]["Row"]
>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
  },
  {
    accessorKey: "due_time",
    header: "Due Date",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
];

export const loanColumns: ColumnDef<
  Database["public"]["Tables"]["loans"]["Row"]
>[] = [
  {
    accessorKey: "counterparty",
    header: "Counterparty",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "direction",
    header: "Direction",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
