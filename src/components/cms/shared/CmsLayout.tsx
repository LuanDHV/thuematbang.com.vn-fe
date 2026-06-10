"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

type CmsLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function CmsLayout({ sidebar, children }: CmsLayoutProps) {
  const isCmsSidebarCollapsed = useUIStore(
    (state) => state.isCmsSidebarCollapsed,
  );

  return (
    <section className="bg-app min-h-screen lg:flex">
      <aside
        className={cn(
          "border-hairline bg-surface fixed inset-y-0 left-0 z-30 w-18 border-r lg:sticky lg:top-0 lg:h-screen lg:shrink-0",
          isCmsSidebarCollapsed ? "lg:w-22" : "lg:w-[18rem]",
        )}
      >
        <div className="h-full">{sidebar}</div>
      </aside>

      <main className="min-w-0 flex-1 pl-18 lg:pl-0">
        <div className="p-4 md:p-5">{children}</div>
      </main>
    </section>
  );
}
