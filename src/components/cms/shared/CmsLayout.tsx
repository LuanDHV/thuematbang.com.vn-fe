"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type CmsLayoutProps = {
  title: string;
  description?: string;
  sidebar: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
  eyebrow?: string;
};

export default function CmsLayout({
  title,
  description,
  sidebar,
  children,
  headerActions,
  eyebrow = "CMS",
}: CmsLayoutProps) {
  return (
    <section className="layout-container layout-section-sm">
      <div className="mb-5 flex items-start justify-between gap-3 lg:hidden">
        <div className="min-w-0">
          <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
            {eyebrow}
          </p>
          <h1 className="text-heading mt-2 text-2xl font-semibold tracking-[-0.03em]">
            {title}
          </h1>
          {description ? (
            <p className="text-secondary mt-2 text-sm leading-6">{description}</p>
          ) : null}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon-lg" aria-label="Mở menu CMS">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(90vw,22rem)] p-0">
            <div className="h-full overflow-y-auto p-3">{sidebar}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,20rem)_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden self-start lg:block">
          <div className="sticky top-24">{sidebar}</div>
        </aside>

        <main className="surface-panel min-w-0 overflow-hidden">
          <div className="border-b border-hairline px-4 py-4 md:px-6 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
                  {eyebrow}
                </p>
                <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                  {title}
                </h1>
                {description ? (
                  <p className="text-secondary text-sm leading-7 md:text-base">
                    {description}
                  </p>
                ) : null}
              </div>

              {headerActions ? (
                <div className="flex flex-wrap items-center gap-2">
                  {headerActions}
                </div>
              ) : null}
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </section>
  );
}
