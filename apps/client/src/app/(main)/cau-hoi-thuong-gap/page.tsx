import type { Metadata } from "next";

import Title from "@/components/common/Title";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Câu hỏi thường gặp",
  description:
    "Tổng hợp các câu hỏi thường gặp về cách tìm tin cho thuê, đăng tin, liên hệ, quy trình sử dụng và những nội dung phổ biến khác để người dùng tra cứu nhanh câu trả lời phù hợp.",
  pathname: "/cau-hoi-thuong-gap",
  noIndex: true,
});

export default function CauHoiThuongGapPage() {
  return (
    <section className="bg-app relative isolate overflow-hidden">
      <div className="bg-primary/12 absolute top-10 left-1/2 h-56 w-56 translate-x-[-125%] rounded-full blur-3xl" />
      <div className="bg-primary/14 absolute right-1/2 bottom-0 h-72 w-72 translate-x-[135%] rounded-full blur-3xl" />

      <div className="layout-container layout-section-lg relative">
        <div className="surface-panel mx-auto max-w-3xl overflow-hidden p-6 md:p-10">
          <div className="space-y-6">
            <Title
              level={1}
              title="Câu hỏi thường gặp đang được hoàn thiện"
              description="Trang này sẽ sớm tổng hợp các câu hỏi phổ biến để người dùng tìm câu trả lời nhanh hơn."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
