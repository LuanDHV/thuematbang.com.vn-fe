import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Quy chế hoạt động",
  description:
    "Nội dung quy chế hoạt động đang được hoàn thiện để công bố đúng chuẩn.",
  pathname: "/quy-che-hoat-dong",
  noIndex: true,
});

export default function QuyCheHoatDongPage() {
  return (
    <UpcomingPage
      title="Quy chế hoạt động đang được hoàn thiện"
      description="Trang này sẽ sớm công bố các quy định vận hành, quyền và nghĩa vụ theo đúng nội dung chính thức."
    />
  );
}
