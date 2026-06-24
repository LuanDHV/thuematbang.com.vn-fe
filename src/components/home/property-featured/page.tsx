import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { PropertyCard } from "@/components/common/PropertyCard";
import HomeCarousel from "@/components/home/HomeCarousel";
import { propertyService } from "@/services/property.service";
import { Property } from "@/types";

export default async function PropertyFeaturedSection() {
  return (
    <section className="layout-section w-full px-4">
      <div className="layout-container w-full">
        <div className="section-intro-tight">
          <Title
            eyebrow="Gợi ý tốt nhất"
            title="Bất động sản nổi bật"
            description="Tuyển chọn các tin đăng cho thuê giá tốt nhất từ khách hàng và doanh nghiệp được xác thực trên hệ thống."
          />
        </div>

        <SafeFetch
          fetcher={propertyService.getAll({
            filters: { priorityStatus: "PREMIUM" },
            limit: 8,
          })}
          debugLabel="Featured Properties Response"
        >
          {(response) => {
            const featuredProperties = (response.data ?? []) as Property[];
            const isEmpty = featuredProperties.length === 0;

            if (isEmpty) {
              return (
                <div className="surface-editorial border-hairline mt-6 flex min-h-36 items-center justify-center rounded-[1.75rem] border border-dashed px-6 py-8 text-center">
                  <p className="text-body text-base font-medium">
                    Bất động sản nổi bật sẽ sớm được cập nhật
                  </p>
                </div>
              );
            }

            return (
              <>
                <HomeCarousel className="mt-6 py-2">
                  {featuredProperties.map((item, index) => (
                    <div key={item.id} className="min-w-0 flex-[0_0_88%] pl-3">
                      <PropertyCard
                        property={item}
                        variant="featured"
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </HomeCarousel>

                <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                  {featuredProperties.map((item, index) => (
                    <PropertyCard
                      key={item.id}
                      property={item}
                      variant="featured"
                      priority={index === 0}
                    />
                  ))}
                </div>
              </>
            );
          }}
        </SafeFetch>

        <div className="mt-8">
          <SeeMoreButton href="/cho-thue" />
        </div>
      </div>
    </section>
  );
}
