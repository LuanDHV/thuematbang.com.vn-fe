import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import PageStructuredData from "@/components/common/PageStructuredData";
import SafeFetch from "@/components/common/SafeFetch";
import DetailTwoColumnLayout from "@/components/listing-detail/DetailTwoColumnLayout";
import NewsDetailContent from "@/components/listing-detail/news/NewsDetailContent";
import NewsDetailSidebar from "@/components/listing-detail/news/NewsDetailSidebar";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import {
  buildNewsCategoryBreadcrumbs,
  parsePagedSlugSegments,
  parseNewsCategoryFromSlug,
} from "@/lib/listing/flat-url";
import {
  buildLatestListingTitle,
  buildPageTitle,
  createPageMetadata,
} from "@/lib/metadata";
import {
  buildMetaDescription,
  buildNewsArticleSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { News } from "@/types/news";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const resolveNews = cache(async (slug: string) => {
  try {
    return await newsService.getBySlug(slug);
  } catch {
    return null;
  }
});

const resolveNewsCategories = cache(async () => {
  return categoryService.getNewsCategories();
});

async function resolveNewsPageContext(slugSegments: string[]) {
  const { rawSlug, page } = parsePagedSlugSegments(slugSegments);

  const categories = await resolveNewsCategories();

  const initialCategorySlug = parseNewsCategoryFromSlug(rawSlug, categories);

  const isCategoryListing =
    Boolean(rawSlug) && initialCategorySlug !== "tin-tuc";

  const shouldTryDetail = Boolean(rawSlug) && !isCategoryListing;

  const newsSlug = rawSlug ?? slugSegments.join("-");

  const news = shouldTryDetail && newsSlug ? await resolveNews(newsSlug) : null;

  return {
    rawSlug,
    page,
    categories,
    initialCategorySlug,
    isCategoryListing,
    shouldTryDetail,
    newsSlug,
    news,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const { news } = await resolveNewsPageContext(slug);

  if (news) {
    return createPageMetadata({
      title: buildPageTitle(news.title),
      description: buildMetaDescription(
        [news.summary, news.content],
        "Xem bài viết tin tức bất động sản để cập nhật xu hướng giá thuê, kinh nghiệm tìm mặt bằng và các phân tích hữu ích giúp bạn theo dõi thị trường tốt hơn.",
      ),
      pathname: `/tin-tuc/${news.slug}`,
      image: news.imageUrl || undefined,
      type: "article",
    });
  }

  return createPageMetadata({
    title: buildLatestListingTitle("Tin tức bất động sản"),
    description:
      "Kho tin tức và kiến thức bất động sản mới nhất, gồm xu hướng thị trường, kinh nghiệm thuê mặt bằng và góc nhìn hữu ích dành cho người đang tìm hiểu nhu cầu thực tế.",
    pathname: `/tin-tuc/${slug.join("/")}`,
  });
}

export default async function TinTucDynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const { rawSlug, page, categories, initialCategorySlug, news } =
    await resolveNewsPageContext(slug);

  if (news) {
    let viewedNews: News[] = [];

    try {
      const { data } = await newsService.getAll({
        page: 1,
        limit: 8,
      });

      viewedNews = (data ?? [])
        .filter((item) => item.id !== news.id)
        .slice(0, 8);
    } catch {
      viewedNews = [];
    }

    return (
      <article className="layout-container layout-section-sm">
        <PageStructuredData
          schemas={[
            buildWebPageSchema({
              title: buildPageTitle(news.title),
              description: buildMetaDescription(
                [news.summary, news.content],
                "Xem bài viết tin tức bất động sản để cập nhật xu hướng giá thuê, kinh nghiệm tìm mặt bằng và các phân tích hữu ích giúp bạn theo dõi thị trường tốt hơn.",
              ),
              url: `/tin-tuc/${news.slug}`,
              image: news.imageUrl || undefined,
              datePublished: news.createdAt,
              dateModified: news.updatedAt,
            }),
            buildNewsArticleSchema({
              title: buildPageTitle(news.title),
              description: buildMetaDescription(
                [news.summary, news.content],
                "Xem bài viết tin tức bất động sản để cập nhật xu hướng giá thuê, kinh nghiệm tìm mặt bằng và các phân tích hữu ích giúp bạn theo dõi thị trường tốt hơn.",
              ),
              url: `/tin-tuc/${news.slug}`,
              image: news.imageUrl || undefined,
              datePublished: news.createdAt,
              dateModified: news.updatedAt,
              categoryName: news.category?.name,
            }),
          ]}
        />
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tin tức", href: "/tin-tuc" },
            { label: news.title },
          ]}
        />

        <DetailTwoColumnLayout
          main={<NewsDetailContent news={news} />}
          aside={<NewsDetailSidebar viewedNews={viewedNews} />}
        />
      </article>
    );
  }

  if (slug.length > 2) {
    notFound();
  }

  const categoryFetch =
    initialCategorySlug === "tin-tuc"
      ? newsService.getAll({
          page,
          limit: 8,
        })
      : newsService.getAll({
          categorySlug: initialCategorySlug,
          page,
          limit: 8,
        });

  return (
    <SafeFetch
      fetcher={categoryFetch}
      debugLabel="News Dynamic Response"
      fallbackMessage="Khong tai duoc danh sach tin tuc."
    >
      {(response) => (
        <NewsListingClient
          newsList={response.data ?? []}
          categories={categories}
          initialCategorySlug={initialCategorySlug}
          breadcrumbItems={buildNewsCategoryBreadcrumbs(rawSlug, categories)}
          paginationMeta={response.meta}
        />
      )}
    </SafeFetch>
  );
}
