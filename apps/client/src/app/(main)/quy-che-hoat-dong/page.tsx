import type { Metadata } from "next";

import StaticPageHtml from "@/components/common/StaticPageHtml";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Quy chế hoạt động",
  description:
    "Tìm hiểu quy chế hoạt động, bao gồm nguyên tắc vận hành, quyền và nghĩa vụ của các bên, cách sử dụng dịch vụ và những nội dung cần biết trước khi đăng hoặc tìm tin trên hệ thống.",
  pathname: "/quy-che-hoat-dong",
});

export default function QuyCheHoatDongPage() {
  return (
    <StaticPageHtml
      siteCode="quy-che-hoat-dong"
      title="Quy chế hoạt động"
      emptyText="Đang cập nhật quy chế hoạt động."
    />
  );
}
