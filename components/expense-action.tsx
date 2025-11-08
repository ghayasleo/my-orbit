import Link from "next/link";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useDeleteExpense } from "@/hooks/use-delete-expense";
import { useState } from "react";
import { Database } from "@/lib/supabase/_database";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

export const ExpenseActions = ({ expense }: { expense: Database["public"]["Tables"]["expenses"]["Row"] }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteExpense = useDeleteExpense();

  const handleDelete = () => {
    deleteExpense.mutate(expense.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href={`/expenses/edit/${expense.id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleteExpense.isPending}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        isLoading={deleteExpense.isPending}
      />
    </>
  );
};