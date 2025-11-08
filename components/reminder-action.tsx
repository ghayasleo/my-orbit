import Link from "next/link";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Database } from "@/lib/supabase/_database";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { useDeleteReminder } from "@/hooks/use-delete-reminder";

export const ReminderActions = ({ reminder }: { reminder: Database["public"]["Tables"]["reminders"]["Row"] }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteReminder = useDeleteReminder();

  const handleDelete = () => {
    deleteReminder.mutate(reminder.id);
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
          <Link href={`/reminders/edit/${reminder.id}`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
          disabled={deleteReminder.isPending}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Reminder"
        description="Are you sure you want to delete this reminder? This action cannot be undone."
        isLoading={deleteReminder.isPending}
      />
    </>
  );
};