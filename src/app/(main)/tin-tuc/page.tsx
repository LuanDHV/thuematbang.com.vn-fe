import type { Metadata } from "next";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import { buildNewsCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return (
    <>
      <NewsListingClient breadcrumbItems={buildNewsCategoryBreadcrumbs()} />
    </>
  );
}
