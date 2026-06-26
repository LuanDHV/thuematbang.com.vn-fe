import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Câu hỏi thường gặp",
  description:
    "Tổng hợp các câu hỏi thường gặp về cách tìm tin cho thuê, đăng tin, liên hệ, quy trình sử dụng và những nội dung phổ biến khác để người dùng tra cứu nhanh câu trả lời phù hợp.",
  pathname: "/cau-hoi-thuong-gap",
  noIndex: true,
});

export default function CauHoiThuongGapPage() {
  return (
    <UpcomingPage
      title="Câu hỏi thường gặp đang được hoàn thiện"
      description="Trang này sẽ sớm tổng hợp các câu hỏi phổ biến để người dùng tìm câu trả lời nhanh hơn."
    />
  );
}
