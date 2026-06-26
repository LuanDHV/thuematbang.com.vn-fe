import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Điều khoản thỏa thuận",
  description:
    "Tham khảo điều khoản thỏa thuận để nắm các quy định sử dụng dịch vụ, phạm vi trách nhiệm, điều kiện áp dụng và quyền lợi liên quan khi bạn tương tác với nền tảng.",
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
