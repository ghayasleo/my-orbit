import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function Header() {
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
            <li
              data-slot="breadcrumb-item"
              className="items-center gap-1.5 hidden md:block"
            >
              <a
                data-slot="breadcrumb-link"
                className="hover:text-foreground transition-colors"
                href="#"
              >
                Building Your Application
              </a>
            </li>
            <li
              data-slot="breadcrumb-separator"
              role="presentation"
              aria-hidden="true"
              className="[&amp;&gt;svg]:size-3.5 hidden md:block"
            >
              <ChevronRightIcon />
            </li>
            <li
              data-slot="breadcrumb-item"
              className="inline-flex items-center gap-1.5"
            >
              <span
                data-slot="breadcrumb-page"
                role="link"
                aria-disabled="true"
                aria-current="page"
                className="text-foreground font-normal"
              >
                Data Fetching
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}

export default Header;
