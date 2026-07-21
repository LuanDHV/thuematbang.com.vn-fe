import { Building2 } from "lucide-react";
import EmptyStateCard from "@/components/common/EmptyStateCard";
import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { PropertyCard } from "@/components/common/PropertyCard";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import Reveal from "@/components/home/Reveal";
import { propertyService } from "@/services/property.service";
import { Property } from "@/types";

const FEATURED_PROPERTIES_REVALIDATE_SECONDS = 300;

export default async function PropertyFeaturedSection() {
  const featuredPropertiesFetch = propertyService.getAll(
    {
      filters: {
        priorityStatus: "PREMIUM",
        status: "PUBLISHED",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      limit: 8,
    },
    {
      cache: "force-cache",
      revalidate: FEATURED_PROPERTIES_REVALIDATE_SECONDS,
      tags: ["properties", "homepage-featured-properties"],
    },
  );

  return (
    <SectionBand tone="primary">
      <div className="layout-section w-full">
        <div className="layout-container w-full">
          <div className="section-intro-tight">
            <Reveal>
              <Title
                eyebrow="Gợi ý tốt nhất"
                title="Tin cho thuê mới"
                description="Tuyển chọn các tin đăng cho thuê giá tốt nhất từ khách hàng và doanh nghiệp được xác thực trên hệ thống."
                variant="home"
              />
            </Reveal>
          </div>

          <SafeFetch
            fetcher={featuredPropertiesFetch}
            debugLabel="Featured Properties Response"
          >
            {(response) => {
              const featuredProperties = (response.data ?? []) as Property[];
              const isEmpty = featuredProperties.length === 0;

              if (isEmpty) {
                return (
                  <EmptyStateCard
                    icon={<Building2 size={20} strokeWidth={2} />}
                    title="Bất động sản nổi bật sẽ sớm được cập nhật"
                    description="Hệ thống sẽ hiển thị các tin nổi bật tốt nhất ngay khi có dữ liệu."
                  />
                );
              }

              return (
                <>
                  <Reveal delay={80}>
                    <HomeCarousel
                      className="py-4"
                      options={{ align: "center" }}
                    >
                      {featuredProperties.map((item) => (
                        <div
                          key={item.id}
                          className="min-w-0 shrink-0 basis-11/12 pl-3"
                        >
                          <PropertyCard
                            property={item}
                            variant="featured"
                          />
                        </div>
                      ))}
                    </HomeCarousel>
                  </Reveal>

                  <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                    {featuredProperties.map((item, index) => (
                      <Reveal key={item.id} delay={index * 70}>
                        <PropertyCard
                          property={item}
                          variant="featured"
                        />
                      </Reveal>
                    ))}
                  </div>
                </>
              );
            }}
          </SafeFetch>

          <SeeMoreButton href="/cho-thue" />
        </div>
      </div>
    </SectionBand>
  );
}
