import { Search } from "lucide-react";

import EmptyStateCard from "@/components/common/EmptyStateCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import NewsCard from "@/components/common/NewsCard";
import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import SectionBand from "@/components/home/SectionBand";
import { newsService } from "@/services/news.service";
import { News } from "@/types/news";

const HOME_NEWS_REVALIDATE_SECONDS = 300;

export default async function NewsSection() {
  const newsFetch = newsService.getAll(
    { limit: 4 },
    {
      cache: "force-cache",
      revalidate: HOME_NEWS_REVALIDATE_SECONDS,
      tags: ["news", "homepage-news"],
    },
  );

  return (
    <SectionBand tone="app">
      <div className="layout-section w-full">
        <div className="layout-container w-full">
          <div className="section-intro-tight text-center">
            <Title
              eyebrow="Cập nhật"
              title="Cẩm nang & Xu hướng thị trường"
              description="Cập nhật xu hướng giá thuê, kinh nghiệm tìm mặt bằng và giải pháp tối ưu vận hành bất động sản."
              variant="home"
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
                  <EmptyStateCard
                    icon={<Search size={20} strokeWidth={2} />}
                    title="Tin tức sẽ sớm được cập nhật"
                    description="Hệ thống sẽ hiển thị bài viết mới ngay khi có nội dung phù hợp."
                  />
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
      </div>
    </SectionBand>
  );
}
