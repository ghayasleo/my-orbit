import { Fragment } from "react";
import { Page } from "@/constants/pages";
import { SidebarTrigger } from "./ui/sidebar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  breadcrumbs?: Page[];
}

function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="cursor-pointer" />
        <div
          data-orientation="vertical"
          role="none"
          data-slot="separator"
          className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mr-2 data-[orientation=vertical]:h-4"
        ></div>
        <nav aria-label="breadcrumb" data-slot="breadcrumb">
          <ol
            data-slot="breadcrumb-list"
            className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word sm:gap-2.5"
          >
            {breadcrumbs?.map((val, id) => {
              return (
                <Fragment key={id}>
                  <li
                    data-slot="breadcrumb-item"
                    className="items-center gap-1.5 hidden md:block"
                  >
                    {id !== breadcrumbs.length - 1 ? (
                      <a
                        data-slot="breadcrumb-link"
                        className="hover:text-foreground transition-colors"
                        href={val.url}
                      >
                        {val.title}
                      </a>
                    ) : (
                      <span
                        data-slot="breadcrumb-page"
                        role="link"
                        aria-disabled="true"
                        aria-current="page"
                        className="text-foreground font-normal"
                      >
                        {val.title}
                      </span>
                    )}
                  </li>
                  {id !== breadcrumbs.length - 1 && (
                    <li
                      data-slot="breadcrumb-separator"
                      role="presentation"
                      aria-hidden="true"
                      className="hidden md:block"
                    >
                      <ChevronRightIcon className="min-w-3.5" />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}

export default Header;
