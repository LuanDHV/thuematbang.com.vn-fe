import Title from "@/components/common/Title";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import NewsCard from "@/components/common/NewsCard";
import FeaturedNewsCard from "@/components/common/FeaturedNewsCard";
import { newsService } from "@/services/news.service";
import DataErrorCard from "@/components/common/DataErrorCard";
import { News } from "@/types/news";

export default async function NewsSection() {
  let sourceNews: News[] = [];
  try {
    const response = await newsService.getAll();
    sourceNews = response.data ?? [];
  } catch {
    return (
      <section className="w-full px-4 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <Title
              title="Tin tức"
              description="Tổng hợp tin tức, kiến thức và xu hướng bất động sản mới nhất."
            />
          </div>
          <DataErrorCard message="Không tải được danh sách tin tức." />
        </div>
      </section>
    );
  }

  const newsList = sourceNews.slice(0, 4);
  const featuredNews = newsList[0];
  const sideNews = newsList.slice(1, 4);

  return (
    <section className="w-full px-4 py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <Title
            title="Tin tức"
            description="Tổng hợp tin tức, kiến thức và xu hướng bất động sản mới nhất."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="min-h-105">
            {featuredNews && <FeaturedNewsCard news={featuredNews} />}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sideNews.map((newsItem) => (
              <NewsCard key={newsItem.id} news={newsItem} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SeeMoreButton href="tin-tuc" />
        </div>
      </div>
    </section>
  );
}
