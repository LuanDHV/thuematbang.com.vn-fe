import FeaturedSection from "@/components/section/featured/page";
import HeroSection from "@/components/section/hero/page";
import IntroduceSection from "@/components/section/introduce/page";
import NewSection from "@/components/section/new/page";
import NewsAndKnowledgeSection from "@/components/section/news-knowledge/page";
import ProjectSection from "@/components/section/project/page";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroduceSection />
      <FeaturedSection />
      <ProjectSection />
      <NewSection />
      <NewsAndKnowledgeSection />
    </>
  );
}
