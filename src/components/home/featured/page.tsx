import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { PropertyCard } from "@/components/common/PropertyCard";
import HomeCarousel from "@/components/home/HomeCarousel";
import { propertyService } from "@/services/property.service";
import { Property } from "@/types";

export default async function FeaturedSection() {
  return (
    <section className="w-full px-4 py-12 lg:flex lg:min-h-screen lg:items-center">
      <div className="layout-container w-full">
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
              <>
                <HomeCarousel className="mt-12 py-2">
                  {featuredProperties.map((item) => (
                    <div
                      key={item.id}
                      className="min-w-0 flex-[0_0_88%] pl-3 md:flex-[0_0_50%]"
                    >
                      <PropertyCard property={item} variant="featured" />
                    </div>
                  ))}
                </HomeCarousel>

                <div className="mt-12 hidden grid-cols-1 gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4">
                  {featuredProperties.map((item) => (
                    <PropertyCard
                      key={item.id}
                      property={item}
                      variant="featured"
                    />
                  ))}
                </div>
              </>
            );
          }}
        </SafeFetch>

        <SeeMoreButton href="/cho-thue" />
      </div>
    </section>
  );
}
