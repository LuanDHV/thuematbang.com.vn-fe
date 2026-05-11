import FeaturedSection from "@/components/home/featured/page";
import HeroSection from "@/components/home/hero/page";
import IntroduceSection from "@/components/home/introduce/page";
import NewsSection from "@/components/home/news/page";
import ProjectSection from "@/components/home/project/page";
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
