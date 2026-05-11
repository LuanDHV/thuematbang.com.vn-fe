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

        <div className="mt-12 flex flex-col gap-6 lg:flex-row">
          {/* SearchBar: Lên đầu ở mobile, bên phải ở desktop */}
          <div className="order-1 h-fit w-full lg:sticky lg:top-24 lg:order-2 lg:w-2/6">
            <SearchBar layout="vertical" />
          </div>

          {/* Properties List: Dưới bộ lọc ở mobile, bên trái ở desktop */}
          <div className="order-2 grid w-full gap-6 lg:order-1 lg:w-4/6">
            {properties?.map((item: Property) => (
              <Link key={item.id} href="...">
                <PropertyCardV2 property={item} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
