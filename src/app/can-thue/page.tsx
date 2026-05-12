import type { Metadata } from "next";
import ByFilter from "@/components/cho-thue/ByFilter";
import ContentSEO from "@/components/cho-thue/ContentSEO";
import FAQ from "@/components/cho-thue/FAQ";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Cần thuê mặt bằng",
  description: "Tổng hợp nhu cầu cần thuê mặt bằng, văn phòng và nhà phố.",
  pathname: "/can-thue",
});

//Tạm thời dùng dữ liệu từ cho thuê cho đến khi sử dụng data thật
export default function CanThuePage() {
  return (
    <>
      <ByFilter />
      <ContentSEO />
      <FAQ />
    </>
  );
}
