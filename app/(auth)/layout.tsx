import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import Header from "@/components/header";
import AppSidebar from "@/components/app-sidebar";
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="px-4 flex-1">
        <Header />
        <div id="main">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}