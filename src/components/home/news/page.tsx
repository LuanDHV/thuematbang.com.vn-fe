import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import NewsCard from "@/components/common/NewsCard";
import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import { newsService } from "@/services/news.service";
import { News } from "@/types/news";

export default async function NewsSection() {
  const newsFetch = newsService.getAll({ limit: 4 });

  return (
    <section className="layout-section w-full">
      <div className="layout-container w-full">
        <div className="section-intro-tight text-center">
          <Title
            eyebrow="Cập nhật"
            title="Cẩm nang & Xu hướng thị trường"
            description="Tổng hợp xu hướng giá thuê, kinh nghiệm tìm mặt bằng kinh doanh cho người thuê và giải pháp tối ưu dòng tiền, vận hành cho chủ bất động sản."
          />
        </div>

        <SafeFetch fetcher={newsFetch} debugLabel="Home News Response">
          {(response) => {
            const sourceNews = (response as { data?: News[] })?.data ?? [];
            const newsList = sourceNews.slice(0, 4);
            const featuredNews = newsList[0];
            const sideNews = newsList.slice(1, 4);
            const isEmpty = sourceNews.length === 0;

            if (isEmpty) {
              return (
                <div className="surface-editorial border-hairline mt-6 flex min-h-36 items-center justify-center rounded-[1.75rem] border border-dashed px-6 py-8 text-center">
                  <p className="text-body text-base font-medium">
                    Tin tức sẽ sớm được cập nhật
                  </p>
                </div>
              );
            }

            return (
              <>
                <div className="space-y-5 md:hidden">
                  {featuredNews ? (
                    <FeaturedNewsCard news={featuredNews} priority />
                  ) : null}

                  <div className="grid grid-cols-1 gap-5">
                    {sideNews.map((newsItem, index) => (
                      <NewsCard
                        key={newsItem.id}
                        news={newsItem}
                        priority={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <div className="hidden grid-cols-1 items-stretch gap-5 md:grid md:grid-cols-2 md:gap-8">
                  {featuredNews ? (
                    <FeaturedNewsCard
                      news={featuredNews}
                      className="aspect-auto h-full min-h-136"
                      priority
                    />
                  ) : null}

                  <div className="grid grid-cols-1 gap-5">
                    {sideNews.map((newsItem, index) => (
                      <NewsCard
                        key={newsItem.id}
                        news={newsItem}
                        priority={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <SeeMoreButton href="/tin-tuc" />
              </>
            );
          }}
        </SafeFetch>
      </div>
    </section>
  );
}
