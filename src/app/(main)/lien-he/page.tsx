import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Liên hệ hỗ trợ",
  description:
    "Thông tin liên hệ hỗ trợ dành cho khách hàng, đối tác và người dùng cần tư vấn, phản hồi hoặc trao đổi về tin đăng, dịch vụ và trải nghiệm sử dụng trên nền tảng.",
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
