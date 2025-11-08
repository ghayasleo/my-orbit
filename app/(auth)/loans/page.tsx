import Header from "@/components/header";
import { loansBreadcrumb } from "@/constants/pages";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={loansBreadcrumb}/>

      <div className="px-4">Loans</div>
    </main>
  );
}

export default Page;
