import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Quy định đăng tin",
  description:
    "Xem quy định đăng tin để chuẩn bị nội dung, hình ảnh, thông tin liên hệ và cách trình bày phù hợp, giúp tin đăng rõ ràng hơn và tăng khả năng tiếp cận đúng người xem.",
  pathname: "/quy-dinh-dang-tin",
  noIndex: true,
});

export default function QuyDinhDangTinPage() {
  return (
    <UpcomingPage
      title="Quy định đăng tin đang được hoàn thiện"
      description="Trang này sẽ sớm hướng dẫn chi tiết về nội dung, hình ảnh và quy trình đăng tin phù hợp."
    />
  );
}
