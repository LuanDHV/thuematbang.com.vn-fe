import type { Metadata } from "next";

import Title from "@/components/common/Title";
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
    <section className="bg-app relative isolate overflow-hidden">
      <div className="bg-primary/12 absolute top-10 left-1/2 h-56 w-56 translate-x-[-125%] rounded-full blur-3xl" />
      <div className="bg-primary/14 absolute right-1/2 bottom-0 h-72 w-72 translate-x-[135%] rounded-full blur-3xl" />

      <div className="layout-container layout-section-lg relative">
        <div className="surface-panel mx-auto max-w-3xl overflow-hidden p-6 md:p-10">
          <div className="space-y-6">
            <Title
              level={1}
              title="Liên hệ hỗ trợ đang được hoàn thiện"
              description="Chúng tôi sẽ sớm công bố đầy đủ kênh liên hệ, thông tin hỗ trợ và thời gian phản hồi."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
