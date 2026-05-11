import type { Metadata } from "next";
import TinTucPageClient from "@/components/tin-tuc/TinTucPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return <TinTucPageClient />;
}
