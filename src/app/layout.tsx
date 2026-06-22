import type { Metadata } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./globals.css";
import { isProductionAppEnv } from "@/lib/app-env";
import { siteConfig } from "@/lib/site-config";
import AppProviders from "@/components/providers/AppProviders";
import PageStructuredData from "@/components/common/PageStructuredData";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";

const isProduction = isProductionAppEnv();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.titleSuffix,
    template: `%s | ${siteConfig.titleSuffix}`,
  },
  description: siteConfig.description,
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
    icon: "/imgs/logo-TMB-black.png",
    apple: "/imgs/logo-TMB-black.png",
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
  return (
    <html lang="vi" suppressHydrationWarning className="h-full antialiased">
      <body className="bg-app text-body min-h-screen">
        <PageStructuredData
          schemas={[buildWebSiteSchema(), buildOrganizationSchema()]}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
