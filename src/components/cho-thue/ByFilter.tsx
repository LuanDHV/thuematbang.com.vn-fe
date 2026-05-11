import Title from "../common/Title";
import { Property } from "@/types/property";
import Link from "next/link";
import PropertyCardV2 from "../common/PropertyCardV2";
import SearchBar from "../common/SearchBar";
import { featuredProperties } from "@/lib/mockData";

export default function ByFilter({
  properties = featuredProperties,
}: {
  properties?: Property[];
}) {
  return (
    <section className="w-full bg-gray-50/50 py-12 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Tái sử dụng Title Component */}
        <Title
          title="Tất cả tin rao ( count ) "
          description="Khám phá những không gian sống và làm việc đẳng cấp nhất, được chúng tôi tuyển chọn kỹ lưỡng về vị trí, tiện ích và giá trị."
        />

        <div className="mt-12 flex gap-6">
          {/* Properties List */}
          <div className="grid w-4/6 gap-6">
            {properties?.map((item: Property) => (
              <Link
                key={item.id}
                href={`/${item?.category?.slug}/${item.slug}`}
                className="block transition-transform duration-300 hover:scale-[1.02]"
              >
                <PropertyCardV2 property={item} />
              </Link>
            ))}
          </div>

          {/* SearchBar Vertical */}
          <div className="sticky top-24 h-fit w-2/6">
            <SearchBar layout="vertical" />
          </div>
        </div>
      </div>
    </section>
  );
}
