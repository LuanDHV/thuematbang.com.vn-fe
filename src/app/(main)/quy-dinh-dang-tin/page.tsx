import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Quy định đăng tin",
  description:
    "Trang quy định đăng tin đang được hoàn thiện để hướng dẫn người dùng đăng bài đúng chuẩn.",
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
