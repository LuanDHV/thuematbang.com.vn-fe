import type { Metadata } from "next";

import StaticPageHtml from "@/components/common/StaticPageHtml";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Điều khoản thỏa thuận",
  description:
    "Tham khảo điều khoản thỏa thuận để nắm các quy định sử dụng dịch vụ, phạm vi trách nhiệm, điều kiện áp dụng và quyền lợi liên quan khi bạn tương tác với nền tảng.",
  pathname: "/dieu-khoan-thoa-thuan",
});

export default function DieuKhoanThoaThuanPage() {
  return (
    <StaticPageHtml
      siteCode="dieu-khoan-thoa-thuan"
      title="Điều khoản thỏa thuận"
      emptyText="Đang cập nhật điều khoản thỏa thuận."
    />
  );
}
