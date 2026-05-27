import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/metadata";
import AppProviders from "@/components/providers/AppProviders";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.description,
    template: "%s | Thuematbang.com.vn",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
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
    icon: "/imgs/brand-logo.png",
    apple: "/imgs/brand-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-app font-sans text-body">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
