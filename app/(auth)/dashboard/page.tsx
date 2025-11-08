import Header from "@/components/header";
import { dashboardBreadcrumb } from "@/constants/pages";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={dashboardBreadcrumb}/>

      <div className="px-4">Dashboard</div>
    </main>
  );
}

export default Page;
