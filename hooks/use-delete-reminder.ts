import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderService } from "@/services/reminder-service";
import { toast } from "sonner";

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reminderService.deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    },
  });
}
