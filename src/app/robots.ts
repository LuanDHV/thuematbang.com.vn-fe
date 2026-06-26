import type { MetadataRoute } from "next";
import { isProductionAppEnv } from "@/lib/app-env";
import { siteConfig } from "@/lib/site-config";

const isProduction = isProductionAppEnv();

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${siteConfig.url}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
