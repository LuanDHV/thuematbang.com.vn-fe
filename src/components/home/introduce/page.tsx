"use client";

import Link from "next/link";

import Title from "@/components/common/Title";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import { Award, Handshake, Layers, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Award className="text-primary h-8 w-8" />,
    title: "Uy Tín Hàng Đầu",
    description: "Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.",
  },
  {
    icon: <Handshake className="text-primary h-8 w-8" />,
    title: "Đội Ngũ Chuyên Nghiệp",
    description:
      "Chuyên viên tư vấn giàu kinh nghiệm, luôn sẵn sàng hỗ trợ 24/7.",
  },
  {
    icon: <Layers className="text-primary h-8 w-8" />,
    title: "Danh Mục Đa Dạng",
    description:
      "Hơn 10,000+ bất động sản chất lượng cao được cập nhật liên tục.",
  },
  {
    icon: <ShieldCheck className="text-primary h-8 w-8" />,
    title: "Bảo Mật Thông Tin",
    description: "Cam kết bảo vệ thông tin và quyền lợi tối đa cho khách hàng.",
  },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <Link
      href="/gioi-thieu"
      className="group border-hairline bg-surface relative flex min-h-56 flex-col items-center rounded-xl border p-5 text-center shadow-(--shadow-card) transition-[border-color,box-shadow] duration-300 ease-in-out hover:border-primary/20 hover:shadow-(--shadow-float)"
    >
      <div className="bg-primary/5 group-hover:border-primary/10 mb-4 rounded-full border border-transparent p-4 transition-colors duration-300">
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
    <SectionBand tone="app">
      <div className="layout-section w-full px-4">
        <div className="layout-container w-full">
          <Title
            eyebrow="Về chúng tôi"
            title="Giải pháp tối ưu cho nhu cầu thuê và cho thuê"
            description="Nền tảng kết nối hàng đầu trong lĩnh vực bất động sản, mang đến giải pháp tối ưu cho mọi nhu cầu thuê và cho thuê. "
            variant="home"
          />

          <HomeCarousel className="mt-6" options={{ align: "center" }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 basis-11/12 pl-3 md:basis-1/2"
              >
                <FeatureCard feature={feature} />
              </div>
            ))}
          </HomeCarousel>

          <div className="mt-5 hidden grid-cols-1 gap-5 md:grid md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
