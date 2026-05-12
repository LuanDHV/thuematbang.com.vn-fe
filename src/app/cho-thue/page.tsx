import type { Metadata } from "next";
import ByFilter from "@/components/cho-thue/ByFilter";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import { createPageMetadata } from "@/lib/metadata";
import FilterBar from "@/components/filter/FilterBar";

export const metadata: Metadata = createPageMetadata({
  title: "Cho thuê mặt bằng",
  description: "Tổng hợp mặt bằng cho thuê mới nhất trên toàn quốc.",
  pathname: "/cho-thue",
});

export default function ChoThuePage() {
  return (
    // Thêm div bao ngoài cùng để định vị sticky
    <div className="relative">
      {/* Thanh Filter*/}
      <div className="sticky top-16 z-40 mx-auto max-w-7xl">
        <FilterBar />
      </div>

      {/* Nội dung bên dưới */}
      <div className="relative">
        <ByFilter />
        <ContentSEO />
        <FAQ />
      </div>
    </div>
  );
}
