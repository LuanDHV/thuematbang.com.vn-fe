import type { Metadata } from "next";
import Banner from "@/components/cho-thue/Banner";
import ByFilter from "@/components/cho-thue/ByFilter";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default function ChoThuePage() {
  return (
    <>
      <Banner />
      <ByFilter />
      <ContentSEO />
      <FAQ />
    </>
  );
}
