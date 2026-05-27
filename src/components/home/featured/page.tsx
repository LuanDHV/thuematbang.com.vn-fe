import Title from "@/components/common/Title";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import { PropertyCard } from "@/components/common/PropertyCard";
import { Property } from "@/types";
import { propertyService } from "@/services/property.service";
import SafeFetch from "@/components/common/SafeFetch";

export default async function FeaturedSection() {
  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto w-full max-w-7xl px-5">
        <Title
          title="Bất động sản nổi bật"
          description="Khám phá những không gian sống và làm việc đẳng cấp nhất, được chúng tôi tuyển chọn kỹ lưỡng về vị trí, tiện ích và giá trị."
        />

        <SafeFetch
          fetcher={propertyService.getAll({
            filters: { isFeatured: true },
            limit: 8,
          })}
          debugLabel="Featured Properties Response"
        >
          {(response) => {
            const featuredProperties = (response.data ?? []) as Property[];
            return (
              <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {featuredProperties.map((item: Property) => (
                  <PropertyCard
                    key={item.id}
                    property={item}
                    variant="featured"
                  />
                ))}
              </div>
            );
          }}
        </SafeFetch>

        <SeeMoreButton href="/cho-thue" />
      </div>
    </section>
  );
}
