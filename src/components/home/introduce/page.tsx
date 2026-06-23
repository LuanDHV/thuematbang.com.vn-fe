"use client";

import Link from "next/link";

import Title from "@/components/common/Title";
import HomeCarousel from "@/components/home/HomeCarousel";
import { ListCheck, LockKeyhole, ShieldCheck, Users } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="text-primary h-8 w-8" />,
    title: "Uy Tín Hàng Đầu",
    description: "Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.",
  },
  {
    icon: <Users className="text-primary h-8 w-8" />,
    title: "Đội Ngũ Chuyên Nghiệp",
    description: "Đội ngũ tư vấn giàu kinh nghiệm, luôn sẵn sàng hỗ trợ 24/7.",
  },
  {
    icon: <ListCheck className="text-primary h-8 w-8" />,
    title: "Danh Mục Đa Dạng",
    description:
      "Hơn 10,000+ bất động sản chất lượng cao được cập nhật liên tục.",
  },
  {
    icon: <LockKeyhole className="text-primary h-8 w-8" />,
    title: "Bảo Mật Thông Tin",
    description: "Cam kết bảo vệ thông tin và quyền lợi tối đa cho khách hàng.",
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <Link
      href="/gioi-thieu"
      className="group hover:shadow-primary/20 border-hairline bg-surface relative flex min-h-64 flex-col items-center rounded-xl border p-5 text-center shadow-(--shadow-card) transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-(--shadow-float)"
    >
      <div className="bg-primary/5 group-hover:bg-primary/10 mb-6 rounded-full p-4 transition-colors duration-300">
        {feature.icon}
      </div>
      <h3 className="text-body mb-4 text-xl font-bold tracking-tight">
        {feature.title}
      </h3>
      <p className="text-secondary text-sm leading-relaxed font-light">
        {feature.description}
      </p>
      <div className="bg-primary absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-b-lg transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export default function IntroduceSection() {
  return (
    <section className="to-primary/10 from-app relative w-full overflow-hidden bg-linear-to-b px-4 py-12 lg:py-16">
      <div className="layout-container w-full">
        <Title
          eyebrow="Giới thiệu"
          title="Nền tảng kết nối mặt bằng đáng tin cậy"
          description="Chúng tôi là nền tảng kết nối hàng đầu trong lĩnh vực bất động sản, mang đến giải pháp tối ưu cho mọi nhu cầu thuê và cho thuê. Với hệ thống danh mục đa dạng và dịch vụ chuyên nghiệp, chúng tôi cam kết tạo ra trải nghiệm tốt nhất cho khách hàng."
        />

        <HomeCarousel className="mt-8" options={{ align: "center" }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_88%] pl-3 md:flex-[0_0_50%]"
            >
              <FeatureCard feature={feature} />
            </div>
          ))}
        </HomeCarousel>

        <div className="mt-8 hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
