import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import {
  buildNewsCategoryBreadcrumbs,
  parseNewsCategoryFromSlug,
} from "@/lib/flat-url";
import { createPageMetadata } from "@/lib/metadata";
import NewsListingClient from "@/components/client/NewsListingClient";
import { mockPosts } from "@/mocks/post";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const getPostBySlug = (slug: string) =>
  mockPosts.find((post) => post.slug === slug);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const joined = slug.join("/");
  const newsSlug = slug.join("-");
  const post = getPostBySlug(newsSlug);

  if (post) {
    return createPageMetadata({
      title: post.title,
      description: post.summary || "Nội dung bài viết tin tức bất động sản.",
      pathname: `/tin-tuc/${post.slug}`,
      image: post.thumbnailUrl || undefined,
      type: "article",
    });
  }

  return createPageMetadata({
    title: "Tin tức",
    description: "Tổng hợp tin tức và kiến thức bất động sản mới nhất.",
    pathname: `/tin-tuc/${joined}`,
  });
}

export default async function TinTucDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const newsSlug = slug.join("-");
  const post = getPostBySlug(newsSlug);

  if (post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DynamicBreadcrumb
          className="mb-6"
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Tin tức", href: "/tin-tuc" },
            { label: post.title },
          ]}
        />
        <h1 className="text-3xl leading-tight font-bold">{post.title}</h1>
        {post.summary ? (
          <p className="mt-4 text-base text-gray-600">{post.summary}</p>
        ) : null}
        {post.content ? (
          <div
            className="mt-6 text-base"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : null}
      </div>
    );
  }

  if (slug.length !== 1) {
    notFound();
  }

  const initialCategorySlug = parseNewsCategoryFromSlug(slug[0]);

  return (
    <NewsListingClient
      initialCategorySlug={initialCategorySlug}
      breadcrumbItems={buildNewsCategoryBreadcrumbs(slug[0])}
    />
  );
}
