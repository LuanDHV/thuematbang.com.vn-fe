import type { ReactNode } from "react";

type CmsLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export default function CmsLayout({ sidebar, children }: CmsLayoutProps) {
  return (
    <section className="bg-app min-h-svh lg:flex">
      <aside className="hidden shrink-0 lg:sticky lg:top-0 lg:block lg:h-svh lg:w-[18rem]">
        <div className="h-full">{sidebar}</div>
      </aside>

      <main className="min-w-0 flex-1 p-5">{children}</main>
    </section>
  );
}
