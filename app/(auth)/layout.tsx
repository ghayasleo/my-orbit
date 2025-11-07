import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="px-4 flex-1">
        <Header />
        <div id="main">{children}</div>
      </div>
    </SidebarProvider>
  );
}
