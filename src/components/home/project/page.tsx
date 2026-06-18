"use client";

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
    icon: <BriefcaseBusiness size={44} strokeWidth={1.2} />,
  },
  { name: "Mặt Bằng", icon: <Store size={44} strokeWidth={1.2} /> },

  {
    name: "Kho xưởng, khu công nghiệp",
    icon: <Factory size={44} strokeWidth={1.2} />,
  },
  { name: "Căn hộ, chung cư", icon: <Building2 size={44} strokeWidth={1.2} /> },
  {
    name: "Trung tâm thương mại",
    icon: <ShoppingBag size={44} strokeWidth={1.2} />,
  },
  {
    name: "Nhà trọ, phòng trọ",
    icon: <BedDouble size={44} strokeWidth={1.2} />,
  },
];

export default function ProjectSection() {
  return (
    <section className="to-primary/10 from-app w-full bg-linear-to-b px-4 py-12 lg:py-16">
      <div className="layout-container w-full">
        <div className="mb-12">
          <Title
            eyebrow="Danh mục"
            title="Danh mục bất động sản"
            description="Khám phá các nhóm bất động sản theo nhu cầu sử dụng, từ văn phòng, mặt bằng bán lẻ đến kho xưởng, khu công nghiệp và nhà ở."
          />
        </div>

        <HomeCarousel options={{ align: "center" }}>
          {categories.map((cat, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_88%] pl-3 md:flex-[0_0_50%]"
            >
              <div className="group hover:border-primary/50 hover:shadow-primary/10 border-hairline bg-surface hover:bg-surface flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="group-hover:text-primary text-body text-center text-base font-bold tracking-tight transition-colors duration-300 lg:text-lg">
                  {cat.name}
                </h3>
                <div className="bg-primary mt-4 h-1 w-0 transition-all duration-300 group-hover:w-12"></div>
              </div>
            </div>
          ))}
        </HomeCarousel>

        <div className="hidden grid-cols-2 gap-5 lg:grid lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="group hover:border-primary/50 hover:shadow-primary/10 border-hairline bg-surface hover:bg-surface flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-5"
            >
              <div className="text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                {cat.icon}
              </div>
              <h3 className="group-hover:text-primary text-body text-center text-base font-bold tracking-tight transition-colors duration-300 lg:text-lg">
                {cat.name}
              </h3>
              <div className="bg-primary mt-4 h-1 w-0 transition-all duration-300 group-hover:w-12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
