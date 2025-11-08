import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { CRUD, expensesPage, homeBreadcrumb, loansPage, remindersPage } from "@/constants/pages";
import Link from "next/link";

function Page() {
  return (
    <main id="main">
      <Header breadcrumbs={homeBreadcrumb} />

      <div className="px-4 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-10">
          <Button asChild variant="rounded" size="rounded" className="bg-chart-1">
            <Link href={`${remindersPage.url}/${CRUD.CREATE}`}>
              <remindersPage.icon className="size-10"/>
              Add {remindersPage.singularTitle}
            </Link>
          </Button>

          <Button asChild variant="rounded" size="rounded" className="bg-chart-2">
            <Link href={`${loansPage.url}/${CRUD.CREATE}`}>
              <loansPage.icon className="size-10"/>
              Add {loansPage.singularTitle}
            </Link>
          </Button>

          <Button asChild variant="rounded" size="rounded" className="bg-chart-3">
            <Link href={`${expensesPage.url}/${CRUD.CREATE}`}>
              <expensesPage.icon className="size-10"/>
              Add {expensesPage.singularTitle}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
