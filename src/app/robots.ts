import type { MetadataRoute } from "next";
import { isProductionAppEnv } from "@/lib/app-env";

const isProduction = isProductionAppEnv();

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
