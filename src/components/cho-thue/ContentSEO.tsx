import { mockContentSeo } from "../../mocks/contentSeo";

export default function ContentSEO() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <article className="prose prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:border-l-4 prose-h2:border-blue-600 prose-h2:pl-4 prose-h2:mt-10 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-blue-700 prose-li:list-disc prose-li:ml-5 max-w-none">
        {/* Render HTML */}
        <div
          dangerouslySetInnerHTML={{ __html: mockContentSeo?.content || "" }}
        />
        {/* Sau này sẽ fetch từ api */}
      </article>
    </div>
  );
}
