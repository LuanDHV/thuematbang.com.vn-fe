import { Search } from "lucide-react";
import EmptyStateCard from "@/components/common/EmptyStateCard";
import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import SectionBand from "@/components/home/SectionBand";
import HomeCarousel from "@/components/home/HomeCarousel";
import Reveal from "@/components/home/Reveal";
import { rentRequestService } from "@/services/rent-request.service";
import type { RentRequest } from "@/types/rent-request";

const HOME_RENT_REQUESTS_REVALIDATE_SECONDS = 300;

export default async function RentRequestExpressSection() {
  const homeRentRequestsFetch = rentRequestService.getAll(
    {
      filters: {
        status: "PUBLISHED",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      limit: 8,
    },
    {
      cache: "force-cache",
      revalidate: HOME_RENT_REQUESTS_REVALIDATE_SECONDS,
      tags: ["rent-requests", "homepage-rent-requests"],
    },
  );

  return (
    <SectionBand tone="secondary">
      <div className="layout-section w-full">
        <div className="layout-container w-full">
          <div className="section-intro-tight">
            <Reveal>
              <Title
                eyebrow="Nhu cầu"
                title="Tin cần thuê mới"
                description="Tập hợp các nhu cầu thuê xác thực, giúp kết nối nhanh giữa người thuê và chủ bất động sản."
                variant="home"
              />
            </Reveal>
          </div>

          <SafeFetch
            fetcher={homeRentRequestsFetch}
            debugLabel="Home Rent Requests Response"
          >
            {(response) => {
              const rentRequests = (response.data ?? []) as RentRequest[];
              const isEmpty = rentRequests.length === 0;

              if (isEmpty) {
                return (
                  <EmptyStateCard
                    icon={<Search size={20} strokeWidth={2} />}
                    title="Nhu cầu thuê mới nhất sẽ sớm được cập nhật"
                    description="Hệ thống sẽ hiển thị các nhu cầu thuê mới nhất ngay khi có dữ liệu."
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
                      {rentRequests.map((item) => (
                        <div
                          key={item.id}
                          className="min-w-0 shrink-0 basis-11/12 pl-3"
                        >
                          <RentRequestCard request={item} variant="featured" />
                        </div>
                      ))}
                    </HomeCarousel>
                  </Reveal>

                  <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                    {rentRequests.map((item, index) => (
                      <Reveal key={item.id} delay={index * 70}>
                        <RentRequestCard request={item} variant="featured" />
                      </Reveal>
                    ))}
                  </div>
                </>
              );
            }}
          </SafeFetch>

          <SeeMoreButton href="/can-thue" />
        </div>
      </div>
    </SectionBand>
  );
}
