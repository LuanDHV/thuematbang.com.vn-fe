import type { Metadata } from "next";
import HeroSection from "@/components/home/hero/page";
import IntroduceSection from "@/components/home/introduce/page";
import NewsSection from "@/components/home/news/page";
import PropertyFeaturedSection from "@/components/home/property-featured/page";
import ProjectSection from "@/components/home/project/page";
import RentRequestExpressSection from "@/components/home/rent-request-express/page";
import { buildPageTitle, createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { connection } from "next/server";

export const metadata: Metadata = createPageMetadata({
  title: buildPageTitle("Sàn bất động sản kết nối nhu cầu thuê và cho thuê"),
  description: siteConfig.description,
  pathname: "/",
});

export default async function HomePage() {
  await connection();

  return (
    <>
      <HeroSection />
      <IntroduceSection />
      <PropertyFeaturedSection />
      <RentRequestExpressSection />
      <ProjectSection />
      <NewsSection />
    </>
  );
}
