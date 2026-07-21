import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { isProductionAppEnv } from "@/lib/app-env";
import { siteConfig } from "@/lib/site-config";
import AppProviders from "@/components/providers/AppProviders";
import PageStructuredData from "@/components/common/PageStructuredData";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";

const isProduction = isProductionAppEnv();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  verification: {
    google: "HECbvh66BjtuaX4WLVSKvG9Gkr2gDJE43dlIe_nqqUE",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.defaultImage],
  },
  icons: {
    icon: "/imgs/logo-symbol.webp",
    apple: "/imgs/logo-symbol.webp",
  },
  robots: isProduction
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        nocache: true,
      },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = siteConfig.googleTagManagerId;
  const shouldEnableGTM =
    isProduction || process.env.NEXT_PUBLIC_ENABLE_GTM_LOCAL;

  return (
    <html lang="vi" suppressHydrationWarning className="h-full antialiased">
      {shouldEnableGTM && gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body className="bg-app text-body min-h-dvh">
        <PageStructuredData
          schemas={[buildWebSiteSchema(), buildOrganizationSchema()]}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
