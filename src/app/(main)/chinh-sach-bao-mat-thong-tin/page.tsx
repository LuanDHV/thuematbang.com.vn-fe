import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Chính sách bảo mật thông tin",
  description:
    "Xem chính sách bảo mật thông tin để hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân trong quá trình bạn truy cập, đăng tin hoặc sử dụng các dịch vụ trên nền tảng.",
  pathname: "/chinh-sach-bao-mat-thong-tin",
  noIndex: true,
});

export default function ChinhSachBaoMatThongTinPage() {
  return (
    <UpcomingPage
      title="Chính sách bảo mật thông tin đang được hoàn thiện"
      description="Chúng tôi sẽ sớm công bố nội dung về thu thập, sử dụng và bảo vệ thông tin người dùng."
    />
  );
}
