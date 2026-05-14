import type { Metadata } from "next";
import { buildNewsCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import NewsListingClient from "@/components/client/NewsListingClient";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return <NewsListingClient breadcrumbItems={buildNewsCategoryBreadcrumbs()} />;
}
