import type { Metadata } from "next";

import StaticPageHtml from "@/components/common/StaticPageHtml";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Chính sách bảo mật thông tin",
  description:
    "Xem chính sách bảo mật thông tin để hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân trong quá trình bạn truy cập, đăng tin hoặc sử dụng các dịch vụ trên nền tảng.",
  pathname: "/chinh-sach-bao-mat-thong-tin",
});

export default function ChinhSachBaoMatThongTinPage() {
  return (
    <StaticPageHtml
      siteCode="chinh-sach-bao-mat-thong-tin"
      title="Chính sách bảo mật thông tin"
      emptyText="Đang cập nhật chính sách bảo mật thông tin."
    />
  );
}
