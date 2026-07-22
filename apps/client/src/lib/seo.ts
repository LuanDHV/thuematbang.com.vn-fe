import type { BreadcrumbItem } from "@/lib/listing/flat-url";
import { optimizeCloudinaryByPreset } from "@/lib/cloudinary";
import { siteConfig } from "@/lib/site-config";

export const SEO_DESCRIPTION_MIN_LENGTH = 100;
export const SEO_DESCRIPTION_MAX_LENGTH = 320;

export function stripHtml(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(
  value: string,
  maxLength = SEO_DESCRIPTION_MAX_LENGTH,
) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  const sliced = normalized.slice(0, maxLength + 1);
  const lastSpace = sliced.lastIndexOf(" ");
  if (lastSpace > Math.floor(maxLength * 0.7)) {
    return `${sliced.slice(0, lastSpace).trimEnd()}...`;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function buildMetaDescription(
  candidates: Array<string | null | undefined>,
  fallback: string,
  maxLength = SEO_DESCRIPTION_MAX_LENGTH,
  minLength = SEO_DESCRIPTION_MIN_LENGTH,
) {
  const normalizedCandidates = candidates
    .map((value) => stripHtml(value))
    .find((value) => value.length > 0);
  const normalizedFallback = stripHtml(fallback);
  const normalizedSiteDescription = stripHtml(siteConfig.description);

  let resolved = normalizedCandidates || normalizedFallback;
  if (resolved.length < minLength) {
    const supplements = [normalizedFallback, normalizedSiteDescription].filter(
      (value) => value && value !== resolved,
    );

    for (const supplement of supplements) {
      resolved = `${resolved} ${supplement}`.trim();
      if (resolved.length >= minLength) break;
    }
  }

  return truncateText(resolved || normalizedFallback, maxLength);
}

export type JsonLdBreadcrumbItem = {
  label: string;
  href?: string;
};

export function buildBreadcrumbListSchema(
  items: JsonLdBreadcrumbItem[],
  canonicalUrl?: string,
) {
  const itemListElement = items
    .filter((item) => item.href)
    .map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href!, siteConfig.url).toString(),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
    ...(canonicalUrl
      ? { url: new URL(canonicalUrl, siteConfig.url).toString() }
      : {}),
  };
}

export function buildFaqPageSchema(
  items: Array<{ question: string; answer: string }>,
  canonicalUrl?: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(canonicalUrl ? { url: canonicalUrl } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildWebPageSchema(options: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string | Date;
  dateModified?: string | Date;
  schemaType?: "WebPage" | "CollectionPage";
}) {
  const resolvedUrl = new URL(options.url, siteConfig.url).toString();
  const resolvedImage = options.image
    ? optimizeCloudinaryByPreset(
        new URL(options.image, siteConfig.url).toString(),
        "seoImage",
      )
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": options.schemaType ?? "WebPage",
    name: options.title,
    headline: options.title,
    description: options.description,
    url: resolvedUrl,
    image: resolvedImage ? [resolvedImage] : undefined,
    datePublished: options.datePublished
      ? new Date(options.datePublished).toISOString()
      : undefined,
    dateModified: options.dateModified
      ? new Date(options.dateModified).toISOString()
      : undefined,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: optimizeCloudinaryByPreset(
      new URL(siteConfig.defaultImage, siteConfig.url).toString(),
      "seoImage",
    ),
  };
}

export function buildNewsArticleSchema(options: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string | Date;
  dateModified?: string | Date;
  categoryName?: string | null;
}) {
  const resolvedUrl = new URL(options.url, siteConfig.url).toString();
  const resolvedImage = options.image
    ? optimizeCloudinaryByPreset(
        new URL(options.image, siteConfig.url).toString(),
        "seoImage",
      )
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: options.title,
    description: options.description,
    url: resolvedUrl,
    image: resolvedImage ? [resolvedImage] : undefined,
    articleSection: options.categoryName ?? undefined,
    datePublished: options.datePublished
      ? new Date(options.datePublished).toISOString()
      : undefined,
    dateModified: options.dateModified
      ? new Date(options.dateModified).toISOString()
      : undefined,
  };
}

export function breadcrumbItemsFromAppBreadcrumb(
  items: BreadcrumbItem[],
): JsonLdBreadcrumbItem[] {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
  }));
}
