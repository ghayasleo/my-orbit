import { useQuery } from "@tanstack/react-query";
import { reminderService } from "@/services/reminder-service";

export function useReminder(id: string | undefined) {
  return useQuery({
    queryKey: ["reminder", id],
    queryFn: () => {
      if (!id) throw new Error("Reminder ID is required");
      return reminderService.getReminderById(id);
    },
    enabled: !!id, // Only fetch when ID is available
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
