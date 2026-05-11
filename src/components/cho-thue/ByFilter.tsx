import Title from "../common/Title";
import { Property } from "@/types/property";
import Link from "next/link";
import { PropertyCard } from "../common/PropertyCard";
import { featuredProperties } from "@/lib/mockData";

export default function ByFilter({
  properties = featuredProperties,
}: {
  properties?: Property[];
}) {
  return (
    <section className="w-full bg-slate-50/50 py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Tái sử dụng Title Component */}
        <Title
          title="Tất cả tin rao ( count ) "
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
      </div>
    </section>
  );
}
