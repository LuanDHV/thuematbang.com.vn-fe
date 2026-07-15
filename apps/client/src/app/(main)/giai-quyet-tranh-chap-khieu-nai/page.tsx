import type { Metadata } from "next";

import StaticPageHtml from "@/components/common/StaticPageHtml";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Giải quyết tranh chấp, khiếu nại",
  description:
    "Xem quy trình giải quyết tranh chấp, khiếu nại để biết cách gửi phản hồi, tiếp nhận thông tin, xử lý vấn đề phát sinh và theo dõi trạng thái phản hồi một cách minh bạch hơn.",
  pathname: "/giai-quyet-tranh-chap-khieu-nai",
});

export default function GiaiQuyetTranhChapKhieuNaiPage() {
  return (
    <StaticPageHtml
      siteCode="giai-quyet-tranh-chap-khieu-nai"
      title="Giải quyết tranh chấp, khiếu nại"
      emptyText="Đang cập nhật nội dung giải quyết tranh chấp, khiếu nại."
    />
  );
}
