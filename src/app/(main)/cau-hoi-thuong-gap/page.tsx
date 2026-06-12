import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Câu hỏi thường gặp",
  description:
    "Trang FAQ đang được chuẩn hóa để tổng hợp các câu hỏi phổ biến và câu trả lời chính xác.",
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
