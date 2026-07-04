import type { Metadata } from "next";

import Title from "@/components/common/Title";
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
    <section className="bg-app relative isolate overflow-hidden">
      <div className="bg-primary/12 absolute top-10 left-1/2 h-56 w-56 translate-x-[-125%] rounded-full blur-3xl" />
      <div className="bg-primary/14 absolute right-1/2 bottom-0 h-72 w-72 translate-x-[135%] rounded-full blur-3xl" />

      <div className="layout-container layout-section-lg relative">
        <div className="surface-panel mx-auto max-w-3xl overflow-hidden p-6 md:p-10">
          <div className="space-y-6">
            <Title
              level={1}
              title="Giới thiệu đang được hoàn thiện"
              description="Trang này sẽ sớm giới thiệu rõ hơn về thương hiệu, định hướng và giá trị cốt lõi của Thuematbang.com.vn."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
