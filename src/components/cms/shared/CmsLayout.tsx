"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUIStore } from "@/stores/ui-store";

type CmsLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function CmsLayout({ sidebar, children }: CmsLayoutProps) {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);

  const mobileSidebar = isValidElement(sidebar)
    ? cloneElement(
        sidebar as ReactElement<{
          onNavigate?: () => void;
        }>,
        {
          onNavigate: () => setMobileMenuOpen(false),
        },
      )
    : sidebar;

  return (
    <section className="bg-app min-h-svh lg:flex">
      <aside className="hidden shrink-0 lg:sticky lg:top-0 lg:block lg:h-svh lg:w-[18rem]">
        <div className="h-full">{sidebar}</div>
      </aside>

      <main className="min-w-0 flex-1 p-5">
        <div className="border-hairline bg-app/92 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-xl lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label="Mở menu CMS">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 gap-0 p-0"
              showCloseButton={false}
              srTitle="Menu CMS"
            >
              <div className="h-full">{mobileSidebar}</div>
            </SheetContent>
          </Sheet>
        </div>

        {children}
      </main>
    </section>
  );
}
