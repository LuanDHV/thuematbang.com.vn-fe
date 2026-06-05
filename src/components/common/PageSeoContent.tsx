import type { SeoContent } from "@/types/seo-content";

type PageSeoContentProps = {
  seoData?: SeoContent | null;
};

export default function PageSeoContent({ seoData }: PageSeoContentProps) {
  const content = seoData?.seoContent?.trim() ?? "";
  if (!content) return null;

  return (
    <section className="layout-container layout-section-sm">
      <article className="surface-panel prose prose-gray prose-headings:mt-8 prose-headings:font-bold prose-p:leading-relaxed max-w-none p-5">
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </section>
  );
}
