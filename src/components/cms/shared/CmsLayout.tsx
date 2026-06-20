"use client";

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

type CmsLayoutProps = {
  sidebar: ReactNode;
  mobileSidebar: ReactNode;
  children: ReactNode;
};

export default function CmsLayout({
  sidebar,
  mobileSidebar,
  children,
}: CmsLayoutProps) {
  const isCmsSidebarCollapsed = useUIStore(
    (state) => state.isCmsSidebarCollapsed,
  );
  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <section className="bg-app min-h-screen">
      <div className="border-hairline bg-surface sticky top-0 z-40 flex h-14 items-center justify-between border-b px-3 lg:hidden">
        <Sheet open={isMobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-lg" aria-label="Mở menu CMS">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0" srTitle="Menu CMS">
            {mobileSidebar}
          </SheetContent>
        </Sheet>
        <div className="text-heading text-sm font-semibold tracking-[0.12em] uppercase">
          CMS
        </div>
        <div className="size-10" />
      </div>

      <div className="lg:flex">
        <aside
          className={cn(
            "border-hairline bg-surface hidden inset-y-0 left-0 z-30 w-18 border-r lg:sticky lg:top-0 lg:block lg:h-screen lg:shrink-0",
            isCmsSidebarCollapsed ? "lg:w-22" : "lg:w-[18rem]",
          )}
        >
          <div className="h-full">{sidebar}</div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="p-3 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </section>
  );
}

