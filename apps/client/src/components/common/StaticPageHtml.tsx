import Title from "@/components/common/Title";
import { staticPageService } from "@/services/static-page.service";

type StaticPageHtmlProps = {
  siteCode: string;
  title: string;
  emptyText?: string;
};

export default async function StaticPageHtml({
  siteCode,
  title,
  emptyText = "Đang cập nhật nội dung.",
}: StaticPageHtmlProps) {
  const page = await staticPageService
    .getBySiteCode(siteCode)
    .catch(() => null);
  const content = page?.content?.trim() ?? "";

  return (
    <section className="layout-container layout-section-sm">
      <div className="surface-card p-5">
        <div className="mb-6">
          <Title level={1} title={title} />
        </div>

        {content ? (
          <div
            className="premium-prose prose prose-sm prose-p:leading-8 prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-[-0.02em] text-body max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-secondary text-sm">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
