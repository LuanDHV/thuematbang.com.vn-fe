import type { Metadata } from "next";

export const siteConfig = {
  name: "Thuematbang.com.vn",
  url: "https://thuematbang.com.vn",
  description: "Kênh thông tin về cho thuê bất động sản số 1 Việt Nam",
  defaultImage: "/imgs/wallpaper-1.jpg",
};

type CreateMetadataOptions = {
  title: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  pathname,
  image = siteConfig.defaultImage,
  type = "website",
}: CreateMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: pathname ? { canonical: pathname } : undefined,
    openGraph: {
      type,
      locale: "vi_VN",
      siteName: siteConfig.name,
      title,
      description,
      url: pathname,
      images: image
        ? [
            {
              url: image,
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
      description,
      images: image ? [image] : undefined,
    },
  };
}
