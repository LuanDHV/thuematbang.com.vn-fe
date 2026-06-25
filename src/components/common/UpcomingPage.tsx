import Link from "next/link";

import { Button } from "@/components/ui/button";

type UpcomingPageProps = {
  title: string;
  description: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

export default function UpcomingPage({
  title,
  description,
  primaryCta = {
    label: "Về trang chủ",
    href: "/",
  },
  secondaryCta = {
    label: "Xem tin cho thuê",
    href: "/cho-thue",
  },
}: UpcomingPageProps) {
  return (
    <section className="bg-app relative isolate overflow-hidden">
      <div className="bg-primary/12 absolute top-10 left-1/2 h-56 w-56 translate-x-[-125%] rounded-full blur-3xl" />
      <div className="bg-primary/14 absolute right-1/2 bottom-0 h-72 w-72 translate-x-[135%] rounded-full blur-3xl" />

      <div className="layout-container layout-section-lg relative">
        <div className="surface-panel mx-auto max-w-3xl overflow-hidden p-6 md:p-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
                Sắp ra mắt
              </p>
              <h1 className="text-heading text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                {title}
              </h1>
              <p className="text-secondary text-sm leading-7 md:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
