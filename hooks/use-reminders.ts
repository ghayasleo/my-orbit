import { useQuery } from "@tanstack/react-query";
import { reminderService } from "@/services/reminder-service";
import { useUser } from "./use-user";

export function useReminders() {
  const { user, isLoading: userLoading } = useUser();

  const {
    data: reminders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reminders", user?.id],
    queryFn: () => {
      if (!user) throw new Error("User not authenticated");
      return reminderService.getReminders(user.id);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    reminders,
    isLoading: userLoading || isLoading,
    error,
  };
}
