import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageMetadata } from "@/lib/metadata";
import { mockPosts } from "../../../../mocks/post";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPostBySlug = (slug: string) => {
  return mockPosts.find((post) => post.slug === slug);
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: "Chi tiết tin tức",
      description: "Nội dung bài viết tin tức bất động sản.",
      pathname: "/tin-tuc",
    });
  }

  return createPageMetadata({
    title: post.title,
    description: post.summary || "Nội dung bài viết tin tức bất động sản.",
    pathname: `/tin-tuc/${post.slug}`,
    image: post.thumbnailUrl || undefined,
    type: "article",
  });
}

export default async function DetailNews({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:py-20">
      <h1 className="text-3xl leading-tight font-bold">{post.title}</h1>
      {post.summary ? (
        <p className="mt-4 text-base text-gray-600">{post.summary}</p>
      ) : null}
      {post.content ? (
        <div className="mt-6 text-base">{post.content}</div>
      ) : null}
    </div>
  );
}
