"use client";

import Link from "next/link";
import {
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Factory,
  ShoppingBag,
  Store,
} from "lucide-react";

import Title from "@/components/common/Title";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import Reveal from "@/components/home/Reveal";

const categories = [
  {
    name: "Văn Phòng",
    href: "/cho-thue/van-phong",
    icon: <BriefcaseBusiness size={40} strokeWidth={1.2} />,
  },
  {
    name: "Mặt Bằng",
    href: "/cho-thue/mat-bang",
    icon: <Store size={40} strokeWidth={1.2} />,
  },
  {
    name: "Kho Xưởng, Khu Công Nghiệp",
    href: "/cho-thue/kho-xuong-khu-cong-nghiep",
    icon: <Factory size={40} strokeWidth={1.2} />,
  },
  {
    name: "Căn Hộ, Chung Cư",
    href: "/cho-thue/can-ho-chung-cu",
    icon: <Building2 size={40} strokeWidth={1.2} />,
  },
  {
    name: "Trung Tâm Thương Mại",
    href: "/cho-thue/trung-tam-thuong-mai",
    icon: <ShoppingBag size={40} strokeWidth={1.2} />,
  },
  {
    name: "Nhà Trọ, Phòng Trọ",
    href: "/cho-thue/nha-tro-phong-tro",
    icon: <BedDouble size={40} strokeWidth={1.2} />,
  },
];

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  return (
    <Link
      href={category.href}
      className="group hover:border-primary/50 hover:shadow-primary/10 border-hairline bg-surface hover:bg-surface flex min-h-48 flex-col items-center justify-center rounded-xl border p-4 shadow-(--shadow-card) transition-[border-color,box-shadow] duration-300 hover:shadow-(--shadow-float)"
    >
      <div className="text-primary mb-2 transition-all duration-300 group-hover:scale-110">
        {category.icon}
      </div>
      <h3 className="group-hover:text-primary text-body text-center text-base font-bold tracking-tight transition-colors duration-300">
        {category.name}
      </h3>
      <div className="bg-primary mt-4 h-1 w-0 transition-all duration-300 group-hover:w-12" />
    </Link>
  );
}

export default function CategorySection() {
  return (
    <SectionBand tone="primary">
      <div className="layout-section w-full">
        <div className="layout-container w-full">
          <Reveal>
            <Title
              eyebrow="Khám phá"
              title="Phân loại theo nhu cầu thị trường"
              description="Danh mục đa dạng, dễ dàng lọc và tìm kiếm theo nhu cầu thuê và cho thuê, giúp bạn nhanh chóng tìm được mặt bằng phù hợp."
              variant="home"
            />
          </Reveal>

          <Reveal delay={80}>
            <HomeCarousel className="py-4" options={{ align: "center" }}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 basis-11/12 pl-3 md:basis-1/2"
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </HomeCarousel>
          </Reveal>

          <div className="mt-5 hidden grid-cols-2 gap-4 md:grid md:grid-cols-3 xl:grid-cols-6">
            {categories.map((category, index) => (
              <Reveal key={index} delay={index * 70}>
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
