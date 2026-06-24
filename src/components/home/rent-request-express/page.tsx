import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import HomeCarousel from "@/components/home/HomeCarousel";
import { rentRequestService } from "@/services/rent-request.service";
import type { RentRequest } from "@/types/rent-request";

export default async function RentRequestExpressSection() {
  return (
    <section className="layout-section w-full px-4">
      <div className="layout-container w-full">
        <div className="section-intro-tight">
          <Title
            eyebrow="Nhu cầu"
            title="Nhu cầu thuê mới nhất"
            description="Danh sách các nhu cầu thuê vừa được đăng tải để bạn theo dõi và kết nối nhanh hơn."
          />
        </div>

        <SafeFetch
          fetcher={rentRequestService.getAll({
            filters: {
              status: "PUBLISHED",
              sortBy: "createdAt",
              sortOrder: "desc",
            },
            limit: 8,
          })}
          debugLabel="Home Rent Requests Response"
        >
          {(response) => {
            const rentRequests = (response.data ?? []) as RentRequest[];
            const isEmpty = rentRequests.length === 0;

            if (isEmpty) {
              return (
                <div className="surface-editorial border-hairline mt-6 flex min-h-36 items-center justify-center rounded-[1.75rem] border border-dashed px-6 py-8 text-center">
                  <p className="text-body text-base font-medium">
                    Nhu cầu thuê mới nhất sẽ sớm được cập nhật
                  </p>
                </div>
              );
            }

            return (
              <>
                <HomeCarousel className="mt-6 py-2">
                  {rentRequests.map((item) => (
                    <div key={item.id} className="min-w-0 flex-[0_0_88%] pl-3">
                      <RentRequestCard request={item} variant="featured" />
                    </div>
                  ))}
                </HomeCarousel>

                <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
                  {rentRequests.map((item) => (
                    <RentRequestCard
                      key={item.id}
                      request={item}
                      variant="featured"
                    />
                  ))}
                </div>
              </>
            );
          }}
        </SafeFetch>

        <SeeMoreButton href="/can-thue" />
      </div>
    </section>
  );
}
