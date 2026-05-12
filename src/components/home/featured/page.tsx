import Title from "@/components/common/Title";
import { Property } from "@/types/property";
import { featuredProperties } from "@/lib/mockData";

import SeeMoreButton from "@/components/common/SeeMoreButton";

import { PropertyCard } from "@/components/common/PropertyCard";

export default function FeaturedSection({
  properties = featuredProperties,
}: {
  properties?: Property[];
}) {
  const isFeatured = new Set(
    properties.filter((p) => p.isFeatured).map((p) => p.id),
  );
  return (
    <section className="w-full bg-gray-50/50 py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Tái sử dụng Title Component */}
        <Title
          title="Bất động sản nổi bật"
          description="Khám phá những không gian sống và làm việc đẳng cấp nhất, được chúng tôi tuyển chọn kỹ lưỡng về vị trí, tiện ích và giá trị."
        />

        {/* Grid List */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {properties.slice(0, 8).map((item) => (
            <PropertyCard
              key={item.id}
              property={item}
              variant="featured"
              isFeatured={isFeatured.has(item.id)}
            />
          ))}
        </div>

        {/* Nút Xem thêm */}
        <SeeMoreButton href="cho-thue" />
      </div>
    </section>
  );
}
