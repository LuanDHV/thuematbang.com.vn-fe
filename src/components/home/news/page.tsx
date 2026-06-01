import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import NewsCard from "@/components/common/NewsCard";
import SafeFetch from "@/components/common/SafeFetch";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import Title from "@/components/common/Title";
import HomeCarousel from "@/components/home/HomeCarousel";
import { newsService } from "@/services/news.service";
import { News } from "@/types/news";

export default async function NewsSection() {
  const newsFetch = newsService.getAll();

  return (
    <section className="layout-section w-full lg:flex lg:min-h-screen lg:items-center">
      <div className="layout-container w-full">
        <div className="mb-16 text-center">
          <Title
            title="Tin tức"
            description="Tổng hợp tin tức, kiến thức và xu hướng bất động sản mới nhất."
          />
        </div>

        <SafeFetch fetcher={newsFetch} debugLabel="Home News Response">
          {(response) => {
            const sourceNews = (response as { data?: News[] })?.data ?? [];
            const newsList = sourceNews.slice(0, 4);
            const featuredNews = newsList[0];
            const sideNews = newsList.slice(1, 4);

            return (
              <>
                <div className="space-y-5 lg:hidden">
                  <div className="min-h-96">
                    {featuredNews ? (
                      <FeaturedNewsCard news={featuredNews} />
                    ) : null}
                  </div>

                  <HomeCarousel>
                    {sideNews.map((newsItem) => (
                      <div
                        key={newsItem.id}
                        className="min-w-0 flex-[0_0_88%] pl-3 md:flex-[0_0_50%]"
                      >
                        <NewsCard news={newsItem} />
                      </div>
                    ))}
                  </HomeCarousel>
                </div>

                <div className="hidden grid-cols-1 gap-5 lg:grid lg:grid-cols-2 lg:gap-8">
                  <div className="min-h-105">
                    {featuredNews ? (
                      <FeaturedNewsCard news={featuredNews} />
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {sideNews.map((newsItem) => (
                      <NewsCard key={newsItem.id} news={newsItem} />
                    ))}
                  </div>
                </div>

                <div className="mt-16">
                  <SeeMoreButton href="tin-tuc" />
                </div>
              </>
            );
          }}
        </SafeFetch>
      </div>
    </section>
  );
}
