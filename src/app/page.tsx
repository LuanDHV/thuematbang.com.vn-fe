import FeaturedSection from "@/components/section/featured/page";
import HeroSection from "@/components/section/hero/page";
import IntroduceSection from "@/components/section/introduce/page";
import NewsSection from "@/components/section/news/page";

import ProjectSection from "@/components/section/project/page";
import { featuredProperties } from "@/lib/mockData";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroduceSection />
      <FeaturedSection properties={featuredProperties} />
      <ProjectSection />
      <NewsSection />
    </>
  );
}
