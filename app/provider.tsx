"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/auth-context";
import { queryClient } from "@/lib/react-query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
