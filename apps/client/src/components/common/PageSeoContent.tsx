import type { SeoContent } from "@/types/seo-content";

type PageSeoContentProps = {
  seoData?: SeoContent | null;
};

export default function PageSeoContent({ seoData }: PageSeoContentProps) {
  const content = seoData?.seoContent?.trim() ?? "";

  return (
    <section className="layout-container pt-5 pb-8 md:pt-6 md:pb-10">
      <article className="surface-editorial prose prose-gray prose-headings:mt-6 prose-headings:font-bold prose-p:leading-8 max-w-none p-5 lg:p-6">
        {content ? (
          <div
            className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-secondary text-sm">
            Nội dung SEO đang được cập nhật.
          </p>
        )}
      </article>
    </section>
  );
}
