import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import TinTucPageClient from "@/components/client/TinTucPageClient";

export const metadata: Metadata = createPageMetadata({
  title: "Tin tức",
  description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
  pathname: "/tin-tuc",
});

export default function TinTucPage() {
  return <TinTucPageClient />;
}
