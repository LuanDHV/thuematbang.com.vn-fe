import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Liên hệ hỗ trợ",
  description:
    "Kênh liên hệ chính thức đang được hoàn thiện để hỗ trợ khách hàng tốt hơn.",
  pathname: "/lien-he",
  noIndex: true,
});

export default function LienHePage() {
  return (
    <UpcomingPage
      title="Liên hệ hỗ trợ đang được hoàn thiện"
      description="Chúng tôi sẽ sớm công bố đầy đủ kênh liên hệ, thông tin hỗ trợ và thời gian phản hồi."
    />
  );
}
