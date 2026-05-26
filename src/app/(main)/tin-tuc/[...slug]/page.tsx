import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Eye, Layers } from "lucide-react";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import SafeFetch from "@/components/common/SafeFetch";
import NewsListingClient from "@/components/listing-client/NewsListingClient";
import {
  buildNewsCategoryBreadcrumbs,
  parsePagedSlugSegments,
  parseNewsCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { News } from "@/types/news";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const RELATED_ITEMS_LIMIT = 8;

async function resolveNews(slug: string) {
  try {
    return await newsService.getBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { rawSlug } = parsePagedSlugSegments(slug);
  const joined = slug.join("/");
  const categories = await categoryService.getNewsCategories();
  const isCategorySlug =
    Boolean(rawSlug) &&
    parseNewsCategoryFromSlug(rawSlug, categories) !== "tin-tuc";
  const newsSlug = rawSlug ?? slug.join("-");
  const news = !isCategorySlug && newsSlug ? await resolveNews(newsSlug) : null;

  if (news) {
    return createPageMetadata({
      title: news.title,
      description: news.summary || "Nội dung bài viết tin tức bất động sản.",
      pathname: `/tin-tuc/${news.slug}`,
      image: news.imageUrl || undefined,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Tin tức",
    description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
    pathname: `/tin-tuc/${joined}`,
  });
}

export default async function TinTucDynamicPage({ params }: PageProps) {
  // Parse slug + optional /pN segment from dynamic route.
  const { slug } = await params;
  const { rawSlug, page } = parsePagedSlugSegments(slug);
  const categories = await categoryService.getNewsCategories();
  const initialCategorySlug = parseNewsCategoryFromSlug(rawSlug, categories);
  const isCategoryListing =
    Boolean(rawSlug) && initialCategorySlug !== "tin-tuc";
  const shouldTryDetail = Boolean(rawSlug) && !isCategoryListing;
  const newsSlug = rawSlug ?? slug.join("-");
  const news = shouldTryDetail ? await resolveNews(newsSlug) : null;

  // Detail branch: render a single news article when slug is a real article slug.
  if (news) {
    let newsItems: News[] = [];
    try {
      // Fetch side list for "related news" in detail view.
      const listResponse = await newsService.getAll({
        page: 1,
        limit: RELATED_ITEMS_LIMIT,
      });
      newsItems = listResponse.data ?? [];
    } catch {
      newsItems = [];
    }
    const viewedNews = newsItems
      .filter((item) => item.id !== news.id)
      .slice(0, 10);

    return (
      <article className="mx-auto max-w-7xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tin tức", href: "/tin-tuc" },
            { label: news.title },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-6 lg:col-span-8">
            <section>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
                <Image
                  src={news.imageUrl || "/imgs/wallpaper-1.jpg"}
                  alt={news.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            </section>

            <section>
              <h1 className="text-2xl leading-tight font-bold text-gray-900 lg:text-4xl">
                {news.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {news.category?.name ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    <Layers size={12} className="text-primary" />
                    Danh mục: {news.category.name}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  <CalendarDays size={12} className="text-primary" />
                  Ngày đăng: {formatDate(news.createdAt)}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  <Eye size={12} className="text-primary" />
                  Lượt xem: {(news.viewCount || 0).toLocaleString("vi-VN")}
                </span>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin mô tả
                </h2>
              </div>
              <p className="text-base leading-relaxed text-gray-600">
                {news.summary || "Đang cập nhật thông tin mô tả."}
              </p>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Thông tin chi tiết
                </h2>
              </div>

              {news.content ? (
                <div
                  className="prose prose-gray prose-headings:font-semibold prose-p:leading-relaxed max-w-none text-gray-700"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  Nội dung bài viết đang được cập nhật.
                </p>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-4 lg:sticky lg:top-24">
              <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">
                  Tin tức khác
                </h2>

                <div className="mt-3 grid divide-y divide-gray-100">
                  {viewedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/tin-tuc/${item.slug}`}
                      className="group hover:text-primary py-2.5 text-sm text-gray-700 transition-colors duration-200 ease-in-out"
                    >
                      <span className="line-clamp-2 font-medium">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </article>
    );
  }

  if (slug.length > 2) {
    // Guard invalid nested paths under /tin-tuc.
    notFound();
  }

  // Listing branch: render category/all news with parsed page.
  const categoryFetch =
    initialCategorySlug === "tin-tuc"
      ? newsService.getAll({ page, limit: RELATED_ITEMS_LIMIT })
      : newsService.getAll({
          categorySlug: initialCategorySlug,
          page,
          limit: RELATED_ITEMS_LIMIT,
        });

  return (
    <SafeFetch fetcher={categoryFetch}>
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
