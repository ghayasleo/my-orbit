import Header from "@/components/header";
import { expensesBreadcrumb } from "@/constants/pages";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={expensesBreadcrumb}/>

      <div className="px-4">Expenses</div>
    </main>
  );
}

export default Page;
