import Link from "next/link";
import { ArrowUpRight, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";

type DetailMobileCtaBarProps = {
  contactHref: string;
  contactLabel: string;
  phoneHref?: string | null;
  phoneLabel: string;
};

export default function DetailMobileCtaBar({
  contactHref,
  contactLabel,
  phoneHref,
  phoneLabel,
}: DetailMobileCtaBarProps) {
  return (
    <div className="border-hairline bg-surface/96 fixed inset-x-0 bottom-0 z-80 border-t shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
      <div className="layout-container py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="grid grid-cols-2 gap-3">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 w-full rounded-xl"
          >
            <Link href={contactHref}>
              <ArrowUpRight className="size-4" />
              {contactLabel}
            </Link>
          </Button>

          <Button asChild size="lg" className="h-11 w-full rounded-xl">
            <Link href={phoneHref || "/dang-nhap"}>
              <PhoneCall className="size-4" />
              {phoneLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
