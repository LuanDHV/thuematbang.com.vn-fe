import { PropertyCard } from "@/components/common/PropertyCard";
import Title from "@/components/common/Title";
import { Property } from "@/types/property";
import { featuredProperties } from "@/lib/mockData";
import Link from "next/link";
import SeeMoreButton from "@/components/common/SeeMoreButton";

export default function FeaturedSection({
  properties = featuredProperties,
}: {
  properties?: Property[];
}) {
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
          {properties?.map((item: Property) => (
            <Link
              key={item.id}
              href={`/${item?.category?.slug}/${item.slug}`}
              className="block transition-transform duration-300 hover:scale-[1.02]"
            >
              <PropertyCard property={item} />
            </Link>
          ))}
        </div>

        {/* Nút Xem thêm */}
        <SeeMoreButton href="can-thue" />
      </div>
    </section>
  );
}
