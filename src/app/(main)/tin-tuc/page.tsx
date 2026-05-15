import type { Metadata } from "next";
import { buildNewsCategoryBreadcrumbs } from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import NewsListingClient from "@/components/listing-client/NewsListingClient";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tá»©c",
  description: "Tá»•ng há»£p tin tá»©c vÃ  kiáº¿n thá»©c báº¥t Ä‘á»™ng sáº£n má»›i nháº¥t.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return <NewsListingClient breadcrumbItems={buildNewsCategoryBreadcrumbs()} />;
}
