import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Giải quyết tranh chấp, khiếu nại",
  description:
    "Trang xử lý tranh chấp và khiếu nại đang được hoàn thiện để công bố quy trình rõ ràng hơn.",
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
