import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type CmsBackLinkProps = {
  href: string;
  label?: string;
};

export default function CmsBackLink({
  href,
  label = "Quay lại danh sách",
}: CmsBackLinkProps) {
  return (
    <Button asChild variant="outline" size="sm" className="w-fit">
      <Link href={href}>
        <ArrowLeft className="size-4" />
        <span>{label}</span>
      </Link>
    </Button>
  );
}
