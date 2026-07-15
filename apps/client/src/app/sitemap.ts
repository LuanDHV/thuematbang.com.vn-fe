import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { categoryService } from "@/services/category.service";
import { newsService } from "@/services/news.service";
import { projectService } from "@/services/project.service";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";

type Timestamped = {
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
};

function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}

function toLastModified(value?: Date | string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toLastModifiedFromItems(items: Timestamped[]) {
  const timestamps = items
    .flatMap((item) => [item.updatedAt, item.createdAt])
    .filter(Boolean)
    .map((value) => new Date(value as Date | string))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  return timestamps[0];
}

async function fetchAllPages<T extends Timestamped>(
  fetchPage: (
    page: number,
    limit: number,
  ) => Promise<{
    data?: T[];
    meta?: {
      currentPage?: number;
      totalPage?: number;
      hasNextPage?: boolean;
    };
  }>,
  limit = 100,
) {
  const results: T[] = [];
  let page = 1;

  // Loop until the backend tells us there are no more pages.
  while (true) {
    const response = await fetchPage(page, limit);
    const items = response.data ?? [];
    results.push(...items);

    const meta = response.meta;
    const totalPage = meta?.totalPage;
    const hasNextPage = meta?.hasNextPage;

    if (hasNextPage === false) break;
    if (typeof totalPage === "number" && page >= totalPage) break;
    if (items.length < limit) break;

    page += 1;
  }

  return results;
}

function buildEntries(
  paths: Array<{
    pathname: string;
    lastModified?: Date | string | null;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }>,
): MetadataRoute.Sitemap {
  return paths.map((entry) => ({
    url: absoluteUrl(entry.pathname),
    lastModified: toLastModified(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    newsCategories,
    projectCategories,
    newsItems,
    projectItems,
    propertyItems,
    rentRequestItems,
  ] = await Promise.all([
    categoryService.getNewsCategories().catch(() => []),
    categoryService.getProjectCategories().catch(() => []),
    fetchAllPages((page, limit) =>
      newsService.getAll({
        page,
        limit,
        filters: { status: "PUBLISHED" },
      }),
    ).catch(() => []),
    fetchAllPages((page, limit) =>
      projectService.getAll({
        page,
        limit,
        filters: { status: "PUBLISHED" },
      }),
    ).catch(() => []),
    fetchAllPages((page, limit) =>
      propertyService.getAll({
        page,
        limit,
        filters: { status: "PUBLISHED" },
      }),
    ).catch(() => []),
    fetchAllPages((page, limit) =>
      rentRequestService.getAll({
        page,
        limit,
        filters: { status: "PUBLISHED" },
      }),
    ).catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = buildEntries([
    { pathname: "/", priority: 1, changeFrequency: "daily" },
    { pathname: "/cho-thue", priority: 0.9, changeFrequency: "daily" },
    { pathname: "/can-thue", priority: 0.9, changeFrequency: "daily" },
    { pathname: "/du-an", priority: 0.9, changeFrequency: "daily" },
    { pathname: "/tin-tuc", priority: 0.9, changeFrequency: "daily" },
    { pathname: "/gioi-thieu", priority: 0.4, changeFrequency: "monthly" },
    { pathname: "/lien-he", priority: 0.4, changeFrequency: "monthly" },
    {
      pathname: "/quy-che-hoat-dong",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/quy-dinh-dang-tin",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/dieu-khoan-thoa-thuan",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/chinh-sach-bao-mat-thong-tin",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/giai-quyet-tranh-chap-khieu-nai",
      priority: 0.3,
      changeFrequency: "yearly",
    },
    {
      pathname: "/cau-hoi-thuong-gap",
      priority: 0.4,
      changeFrequency: "monthly",
    },
  ]);

  const newsCategoryEntries = buildEntries(
    newsCategories
      .filter((category) => category.slug !== "tin-tuc")
      .map((category) => ({
        pathname:
          category.slug === "tin-tuc"
            ? "/tin-tuc"
            : `/tin-tuc/${category.slug}`,
        lastModified: category.updatedAt,
        priority: 0.7,
        changeFrequency: "weekly",
      })),
  );

  const projectCategoryEntries = buildEntries(
    projectCategories
      .filter((category) => category.slug !== "du-an")
      .map((category) => ({
        pathname:
          category.slug === "du-an" ? "/du-an" : `/du-an/${category.slug}`,
        lastModified: category.updatedAt,
        priority: 0.7,
        changeFrequency: "weekly",
      })),
  );

  const newsDetailEntries = buildEntries(
    newsItems.map((item) => ({
      pathname: `/tin-tuc/${item.slug}`,
      lastModified: item.updatedAt ?? item.createdAt,
      priority: 0.8,
      changeFrequency: "weekly",
    })),
  );

  const projectDetailEntries = buildEntries(
    projectItems.map((item) => ({
      pathname: `/du-an/${item.slug}`,
      lastModified: item.updatedAt ?? item.createdAt,
      priority: 0.8,
      changeFrequency: "weekly",
    })),
  );

  const propertyDetailEntries = buildEntries(
    propertyItems.map((item) => ({
      pathname: `/cho-thue/${item.slug}`,
      lastModified: item.updatedAt ?? item.createdAt,
      priority: 0.8,
      changeFrequency: "weekly",
    })),
  );

  const rentRequestDetailEntries = buildEntries(
    rentRequestItems.map((item) => ({
      pathname: `/can-thue/${item.slug}`,
      lastModified: item.updatedAt ?? item.createdAt,
      priority: 0.8,
      changeFrequency: "weekly",
    })),
  );

  const latestKnownUpdate = toLastModifiedFromItems([
    ...newsItems,
    ...projectItems,
    ...propertyItems,
    ...rentRequestItems,
  ]);

  return [
    ...staticEntries.map((entry) => ({
      ...entry,
      lastModified: entry.lastModified ?? latestKnownUpdate,
    })),
    ...newsCategoryEntries,
    ...projectCategoryEntries,
    ...newsDetailEntries,
    ...projectDetailEntries,
    ...propertyDetailEntries,
    ...rentRequestDetailEntries,
  ];
}
