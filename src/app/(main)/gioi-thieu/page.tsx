import type { Metadata } from "next";

import UpcomingPage from "@/components/common/UpcomingPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Giới thiệu",
  description:
    "Tìm hiểu nền tảng hỗ trợ người dùng tra cứu tin cho thuê, nhu cầu cần thuê, dự án và tin tức bất động sản, đồng thời kết nối nhanh hơn giữa người đăng tin và người đang tìm kiếm mặt bằng phù hợp.",
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
