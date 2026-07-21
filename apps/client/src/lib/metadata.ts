import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetaDescription } from "@/lib/seo";

export const PAGE_TITLE_MAX_LENGTH = 60;
export const HO_CHI_MINH_TIME_ZONE = "Asia/Ho_Chi_Minh";
const BRAND_NAME = siteConfig.name;
const BRAND_SUFFIX = ` - ${BRAND_NAME}`;

type CreateMetadataOptions = {
  title: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function normalizePageTitle(
  value?: string | null,
  fallback = siteConfig.name,
  maxLength = PAGE_TITLE_MAX_LENGTH,
) {
  const normalized = value?.trim().replace(/\s+/g, " ") ?? "";
  const resolved = normalized || fallback;
  if (resolved.length <= maxLength) return resolved;

  const safeLength = Math.max(maxLength - 3, 1);
  const sliced = resolved.slice(0, safeLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > Math.floor(safeLength * 0.7)) {
    return `${sliced.slice(0, lastSpace).trimEnd()}...`;
  }

  return `${resolved.slice(0, safeLength).trimEnd()}...`;
}

export function buildPageTitle(value?: string | null) {
  const normalized = normalizePageTitle(value);

  if (normalized.includes(BRAND_NAME)) {
    return normalized;
  }

  const candidate = `${normalized}${BRAND_SUFFIX}`;
  if (candidate.length <= PAGE_TITLE_MAX_LENGTH) {
    return candidate;
  }

  return normalizePageTitle(normalized, BRAND_NAME, PAGE_TITLE_MAX_LENGTH);
}

export function buildMonthYearLabel(date = new Date()) {
  const parts = new Intl.DateTimeFormat("vi-VN", {
    timeZone: HO_CHI_MINH_TIME_ZONE,
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  if (!month || !year) {
    return "";
  }

  return `T${Number(month)}/${year}`;
}

export function buildLatestListingTitle(
  baseLabel: string,
  options?: {
    descriptor?: string;
    date?: Date;
  },
) {
  const descriptor = options?.descriptor?.trim();
  const monthYear = buildMonthYearLabel(options?.date);
  const title = descriptor
    ? `${baseLabel} ${descriptor} mới nhất ${monthYear}`
    : `${baseLabel} mới nhất ${monthYear}`;

  return buildPageTitle(title);
}

export function createPageMetadata({
  title,
  description,
  pathname,
  image = siteConfig.defaultImage,
  type = "website",
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  const normalizedTitle = buildPageTitle(title);
  const normalizedDescription = description
    ? buildMetaDescription([description], description)
    : undefined;
  const normalizedImage = image
    ? new URL(image, siteConfig.url).toString()
    : undefined;
  const canonicalUrl = pathname
    ? new URL(pathname, siteConfig.url).toString()
    : undefined;

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      type,
      locale: "vi_VN",
      siteName: siteConfig.name,
      title: normalizedTitle,
      description: normalizedDescription,
      url: canonicalUrl,
      images: normalizedImage
        ? [
            {
              url: normalizedImage,
              width: 1200,
              height: 630,
              alt: normalizedTitle,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description: normalizedDescription,
      images: normalizedImage ? [normalizedImage] : undefined,
    },
  };
}
