import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import TinTucPageClient from "@/components/client/TinTucPageClient";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return (
    <>
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <DynamicBreadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]}
        />
      </div>
      <TinTucPageClient />
    </>
  );
}
