import Header from "@/components/header";
import { homeBreadcrumb } from "@/constants/pages";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={homeBreadcrumb}/>

      <div className="px-4">Home</div>
    </main>
  );
}

export default Page;
