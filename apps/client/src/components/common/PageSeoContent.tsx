import type { SeoContent } from "@/types/seo-content";
import PageSeoContentCollapsible from "@/components/common/PageSeoContentCollapsible";

type PageSeoContentProps = {
  seoData?: SeoContent | null;
};

export default function PageSeoContent({ seoData }: PageSeoContentProps) {
  const content = seoData?.seoContent?.trim() ?? "";

  if (!content) {
    return null;
  }

  return (
    <section className="layout-container pt-5 pb-8 md:pt-6 md:pb-10">
      <article className="surface-editorial prose prose-gray prose-headings:mt-6 prose-headings:font-bold prose-p:leading-8 max-w-none p-5 lg:p-6">
        <PageSeoContentCollapsible content={content} />
      </article>
    </section>
  );
}
