import type { SeoContent } from "@/types/seo-content";

type PageSeoContentProps = {
  seoData?: SeoContent | null;
};

export default function PageSeoContent({ seoData }: PageSeoContentProps) {
  const content = seoData?.seoContent?.trim() ?? "";
  if (!content) return null;

  return (
    <section className="layout-container pt-5 pb-8 md:pt-6 md:pb-10">
      <article className="surface-editorial prose prose-gray prose-headings:mt-6 prose-headings:font-bold prose-p:leading-8 max-w-none rounded-[1.75rem] p-5 lg:p-6">
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </section>
  );
}
