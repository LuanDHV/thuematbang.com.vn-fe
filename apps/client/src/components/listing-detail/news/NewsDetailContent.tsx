import { CalendarDays, Eye, Layers } from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import NewsDetailAnalytics from "@/components/listing-detail/news/NewsDetailAnalytics";
import { formatDate, formatNumber } from "@/lib/format";
import { News } from "@/types/news";

type NewsDetailContentProps = {
  news: News;
};

export default function NewsDetailContent({ news }: NewsDetailContentProps) {
  return (
    <div className="surface-card flex flex-col gap-6 p-5 lg:gap-8">
      <NewsDetailAnalytics
        listingId={news.id}
        listingTitle={news.title}
        categoryId={news.categoryId}
        categoryName={news.category?.name}
        isFeatured={news.isFeatured}
      />
      <section>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          <CloudinaryImage
            src={news.imageUrl || "/imgs/fallback.webp"}
            alt={news.title}
            width={1600}
            height={900}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="h-full w-full object-cover"
            priority
            fallbackSrc="/imgs/fallback.webp"
          />
        </div>
      </section>

      <section>
        <h1 className="text-heading text-3xl leading-tight font-semibold tracking-[-0.03em]">
          {news.title}
        </h1>

        <div className="text-secondary mt-3 flex flex-wrap items-center gap-2 text-sm">
          {news.category?.name ? (
            <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Layers size={14} className="text-primary" />
              Danh mục: {news.category.name}
            </span>
          ) : null}

          <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <CalendarDays size={14} className="text-primary" />
            Ngày đăng: {formatDate(news.createdAt)}
          </span>

          <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Eye size={14} className="text-primary" />
            Lượt xem: {formatNumber(news.viewCount, { fallback: "0" })}
          </span>
        </div>
      </section>

      <section>
        {news.content ? (
          <div
            className="premium-prose prose prose-sm max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        ) : (
          <p className="text-secondary text-sm">Nội dung bài viết đang được cập nhật.</p>
        )}
      </section>
    </div>
  );
}
