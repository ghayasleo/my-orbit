import Header from "@/components/header";
import { remindersBreadcrumb } from "@/constants/pages";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={remindersBreadcrumb}/>

      <div className="px-4">Reminders</div>
    </main>
  );
}

export default Page;
