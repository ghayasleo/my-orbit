import _ from "lodash";
import {
  BanknotesIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export interface Page {
  title: string;
  url: string;
  singularTitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export enum CRUD {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
}

export const homePage: Page = {
  title: "Home",
  url: "/",
  icon: HomeIcon,
};
export const dashboardPage: Page = {
  title: "Dashboard",
  url: "/dashboard",
  icon: Squares2X2Icon,
};
export const remindersPage: Page = {
  title: "Reminders",
  singularTitle: "Reminder",
  url: "/reminders",
  icon: BellAlertIcon,
};
export const loansPage: Page = {
  title: "Loans",
  singularTitle: "Loan",
  url: "/loans",
  icon: CurrencyDollarIcon,
};
export const expensesPage: Page = {
  title: "Expenses",
  singularTitle: "Expense",
  url: "/expenses",
  icon: BanknotesIcon,
};

// Sudebar Menu
export const menu = [
  homePage,
  dashboardPage,
  remindersPage,
  loansPage,
  expensesPage,
];

// Breadcrumbs
export const homeBreadcrumb = [homePage];
export const dashboardBreadcrumb = [homePage, dashboardPage];
export const remindersBreadcrumb = [homePage, remindersPage];
export const loansBreadcrumb = [homePage, loansPage];
export const expensesBreadcrumb = [homePage, expensesPage];

export function createCrudBreadcrumb(page: Page, crud: CRUD): Page[] {
  if (!page.singularTitle) {
    throw new Error("singularTitle is required to create CRUD breadcrumb");
  }
  return [
    homePage,
    page,
    {
      title: `${_.capitalize(crud)} ${page.singularTitle}`,
      url: `${page.url}/${crud}`,
      icon: page.icon,
    },
  ];
}
