import {
  BanknotesIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export interface Page {
  title: string;
  href?: string;
}

export const homePage = {
  title: "Home",
  url: "/",
  icon: HomeIcon,
};
export const dashboardPage = {
  title: "Dashboard",
  url: "/dashboard",
  icon: Squares2X2Icon,
};
export const remindersPage = {
  title: "Reminders",
  url: "/reminders",
  icon: BellAlertIcon,
};
export const loansPage = {
  title: "Loans",
  url: "/loans",
  icon: CurrencyDollarIcon,
};
export const expensesPage = {
  title: "Expenses",
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
export const homeBreadcrumb: Page[] = [homePage];
export const dashboardBreadcrumb: Page[] = [homePage, dashboardPage];
export const remindersBreadcrumb: Page[] = [homePage, remindersPage];
export const loansBreadcrumb: Page[] = [homePage, loansPage];
export const expensesBreadcrumb: Page[] = [homePage, expensesPage];
