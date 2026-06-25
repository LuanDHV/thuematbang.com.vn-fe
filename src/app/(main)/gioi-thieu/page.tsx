import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Giới thiệu",
  description:
    "Trang giới thiệu đang được hoàn thiện để cung cấp thông tin đầy đủ hơn về Thuematbang.com.vn.",
  pathname: "/gioi-thieu",
  noIndex: true,
});

export default function GioiThieuPage() {
  return (
    <UpcomingPage
      title="Giới thiệu đang được hoàn thiện"
      description="Trang này sẽ sớm giới thiệu rõ hơn về thương hiệu, định hướng và giá trị cốt lõi của Thuematbang.com.vn."
    />
  );
}
