import type { Metadata } from "next";

import StaticPageHtml from "@/components/common/StaticPageHtml";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Quy định đăng tin",
  description:
    "Xem quy định đăng tin để chuẩn bị nội dung, hình ảnh, thông tin liên hệ và cách trình bày phù hợp, giúp tin đăng rõ ràng hơn và tăng khả năng tiếp cận đúng người xem.",
  pathname: "/quy-dinh-dang-tin",
});

export default function QuyDinhDangTinPage() {
  return (
    <StaticPageHtml
      siteCode="quy-dinh-dang-tin"
      title="Quy định đăng tin"
      emptyText="Đang cập nhật quy định đăng tin."
    />
  );
}
