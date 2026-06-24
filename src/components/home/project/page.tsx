"use client";

import Link from "next/link";

import Title from "@/components/common/Title";
import HomeCarousel from "@/components/home/HomeCarousel";
import {
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Factory,
  ShoppingBag,
  Store,
} from "lucide-react";

const categories = [
  {
    name: "Văn Phòng",
    icon: <BriefcaseBusiness size={40} strokeWidth={1.2} />,
  },
  { name: "Mặt Bằng", icon: <Store size={40} strokeWidth={1.2} /> },
  {
    name: "Kho Xưởng, Khu Công Nghiệp",
    icon: <Factory size={40} strokeWidth={1.2} />,
  },
  { name: "Căn Hộ, Chung Cư", icon: <Building2 size={40} strokeWidth={1.2} /> },
  {
    name: "Trung Tâm Thương Mại",
    icon: <ShoppingBag size={40} strokeWidth={1.2} />,
  },
  {
    name: "Nhà Trọ, Phòng Trọ",
    icon: <BedDouble size={40} strokeWidth={1.2} />,
  },
];

function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  return (
    <Link
      href="/du-an"
      className="group hover:border-primary/50 hover:shadow-primary/10 border-hairline bg-surface hover:bg-surface flex min-h-52 flex-col items-center justify-center rounded-xl border p-4 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-float)"
    >
      <div className="text-primary mb-4 transition-all duration-300 group-hover:scale-110">
        {category.icon}
      </div>
      <h3 className="group-hover:text-primary text-body text-center text-base font-bold tracking-tight transition-colors duration-300">
        {category.name}
      </h3>
      <div className="bg-primary mt-4 h-1 w-0 transition-all duration-300 group-hover:w-12" />
    </Link>
  );
}

export default function ProjectSection() {
  return (
    <section className="to-primary/10 from-app w-full bg-linear-to-b px-4 py-10 lg:py-14">
      <div className="layout-container w-full">
        <div className="mb-8">
          <Title
            eyebrow="Khám phá"
            title="Phân loại theo nhu cầu thị trường"
            description="Danh mục đa dạng, dễ dàng lọc và tìm kiếm theo nhu cầu thuê và cho thuê, giúp bạn nhanh chóng tìm được mặt bằng phù hợp."
          />
        </div>

        <HomeCarousel options={{ align: "center" }}>
          {categories.map((category, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_88%] pl-3 md:flex-[0_0_50%]"
            >
              <CategoryCard category={category} />
            </div>
          ))}
        </HomeCarousel>

        <div className="hidden grid-cols-2 gap-4 md:grid md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
