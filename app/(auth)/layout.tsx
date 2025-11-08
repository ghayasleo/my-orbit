import AppSidebar from "@/components/app-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Fragment } from "react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <Fragment>
      <AppSidebar />
      <div className="flex flex-1 [&>main]:w-full [&>main]:flex [&>main]:flex-col [&>main>div]:flex-1">
        {children}
      </div>
    </Fragment>
  );
}
