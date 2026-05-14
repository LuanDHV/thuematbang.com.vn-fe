import Title from "@/components/common/Title";
import {
  Building2,
  Warehouse,
  Factory,
  Home,
  Building,
  Store,
} from "lucide-react";

const categories = [
  { name: "Văn Phòng", icon: <Building2 size={44} strokeWidth={1.2} /> },
  { name: "Kho Bãi", icon: <Warehouse size={44} strokeWidth={1.2} /> },
  { name: "Nhà Xưởng", icon: <Factory size={44} strokeWidth={1.2} /> },
  { name: "Biệt Thự", icon: <Home size={44} strokeWidth={1.2} /> },
  { name: "Chung Cư", icon: <Building size={44} strokeWidth={1.2} /> },
  { name: "Mặt Bằng", icon: <Store size={44} strokeWidth={1.2} /> },
];

export default function ProjectSection() {
  return (
    <section className="to-primary/10 w-full bg-linear-to-b from-white py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Title component - Thêm chút margin bottom để thoáng hơn */}
        <div className="mb-12">
          <Title
            title="Danh Mục Bất Động Sản"
            description="   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
        </div>

        {/* Grid danh mục */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="group hover:border-primary/50 hover:shadow-primary/10 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl"
            >
              {/* Icon Container */}
              <div className="text-primary mb-6 transition-all duration-300 group-hover:scale-110">
                {cat.icon}
              </div>

              {/* Tên danh mục */}
              <h3 className="group-hover:text-primary text-center text-xl font-bold tracking-tight text-gray-700 transition-colors duration-300">
                {cat.name}
              </h3>

              {/* Vạch ngang trang trí khi hover - Làm đậm hơn để bớt chìm */}
              <div className="bg-primary mt-4 h-1 w-0 transition-all duration-300 group-hover:w-12"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
