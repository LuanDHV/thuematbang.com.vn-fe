import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Điều khoản thỏa thuận",
  description:
    "Nội dung điều khoản thỏa thuận đang được hoàn thiện trước khi công bố chính thức.",
  pathname: "/dieu-khoan-thoa-thuan",
  noIndex: true,
});

export default function DieuKhoanThoaThuanPage() {
  return (
    <UpcomingPage
      title="Điều khoản thỏa thuận đang được hoàn thiện"
      description="Trang này sẽ sớm mô tả các điều khoản sử dụng, giới hạn trách nhiệm và các điều kiện liên quan."
    />
  );
}
