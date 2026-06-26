import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Giải quyết tranh chấp, khiếu nại",
  description:
    "Xem quy trình giải quyết tranh chấp, khiếu nại để biết cách gửi phản hồi, tiếp nhận thông tin, xử lý vấn đề phát sinh và theo dõi trạng thái phản hồi một cách minh bạch hơn.",
  pathname: "/giai-quyet-tranh-chap-khieu-nai",
  noIndex: true,
});

export default function GiaiQuyetTranhChapKhieuNaiPage() {
  return (
    <UpcomingPage
      title="Giải quyết tranh chấp, khiếu nại đang được hoàn thiện"
      description="Trang này sẽ sớm nêu rõ quy trình tiếp nhận, xử lý và phản hồi các vấn đề phát sinh."
    />
  );
}
