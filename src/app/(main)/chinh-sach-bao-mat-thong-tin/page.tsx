import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Chính sách bảo mật thông tin",
  description:
    "Trang chính sách bảo mật đang được hoàn thiện theo đúng nội dung công bố chính thức.",
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
