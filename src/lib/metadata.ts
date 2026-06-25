import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetaDescription } from "@/lib/seo";

type CreateMetadataOptions = {
  title: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  pathname,
  image = siteConfig.defaultImage,
  type = "website",
  noIndex = false,
}: CreateMetadataOptions): Metadata {
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
    title,
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
      title,
      description: normalizedDescription,
      url: canonicalUrl,
      images: normalizedImage
        ? [
            {
              url: normalizedImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: normalizedImage ? [normalizedImage] : undefined,
    },
  };
}
