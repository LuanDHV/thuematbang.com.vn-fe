type PageSeoContentProps = {
  content: string;
};

export default function PageSeoContent({ content }: PageSeoContentProps) {
  return (
    <section className="layout-container layout-section-sm">
      <article className="prose prose-gray prose-headings:mt-8 prose-headings:font-bold prose-p:leading-relaxed max-w-none">
        <div
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </section>
  );
}
