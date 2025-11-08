import Link from "next/link";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Database } from "@/lib/supabase/_database";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { useDeleteLoan } from "@/hooks/use-delete-loan";

export const LoanActions = ({ loan }: { loan: Database["public"]["Tables"]["loans"]["Row"] }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteLoan = useDeleteLoan();

  const handleDelete = () => {
    deleteLoan.mutate(loan.id);
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
          <Link href={`/loans/edit/${loan.id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleteLoan.isPending}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Loan"
        description="Are you sure you want to delete this loan? This action cannot be undone."
        isLoading={deleteLoan.isPending}
      />
    </>
  );
};