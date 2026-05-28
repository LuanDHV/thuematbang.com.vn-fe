import type { Metadata } from "next";
import { cache } from "react";
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

      viewedNews = (data ?? []).filter((item) => item.id !== news.id).slice(0, 8);
    } catch {
      viewedNews = [];
    }

    return (
      <article className="layout-container layout-section-sm">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tin tức", href: "/tin-tuc" },
            { label: news.title },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-8 lg:gap-8">
            <section>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-elevated">
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
              <h1 className="text-heading font-serif text-3xl leading-tight font-semibold tracking-[-0.03em] lg:text-5xl">
                {news.title}
              </h1>

              <div className="text-secondary mt-3 flex flex-wrap items-center gap-2 text-sm">
                {news.category?.name ? (
                  <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                    <Layers size={12} className="text-primary" />
                    Danh mục: {news.category.name}
                  </span>
                ) : null}

                <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <CalendarDays size={12} className="text-primary" />
                  Ngày đăng: {formatDate(news.createdAt)}
                </span>

                <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                  <Eye size={12} className="text-primary" />
                  Lượt xem: {(news.viewCount || 0).toLocaleString("vi-VN")}
                </span>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">Thông tin mô tả</h2>
              </div>

              <p className="surface-card text-body rounded-2xl p-5 text-base leading-relaxed">
                {news.summary || "Đang cập nhật thông tin mô tả."}
              </p>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-3">
                <span className="bg-primary h-6 w-1 rounded-full" />
                <h2 className="text-xl font-semibold text-gray-800">Thông tin chi tiết</h2>
              </div>

              {news.content ? (
                <div className="surface-card rounded-2xl p-5">
                  <div
                    className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: news.content }}
                  />
                </div>
              ) : (
                <p className="surface-card text-secondary rounded-2xl p-5 text-sm">
                  Nội dung bài viết đang được cập nhật.
                </p>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <section className="surface-card rounded-2xl border p-5 md:p-6">
                <h2 className="text-heading font-serif text-base font-medium">
                  <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
                  Tin tức khác
                </h2>

                <div className="mt-3 grid divide-y divide-gray-100">
                  {viewedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/tin-tuc/${item.slug}`}
                      className="group text-body hover:text-primary py-2.5 text-sm font-medium transition-all duration-200"
                    >
                      <span className="line-clamp-2">{item.title}</span>
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
      fallbackMessage="Không tải được danh sách tin tức."
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
