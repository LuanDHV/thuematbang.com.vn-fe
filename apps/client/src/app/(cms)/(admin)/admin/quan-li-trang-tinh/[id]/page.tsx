import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateStaticPageAction } from "@/actions/admin-crud.actions";
import AdminStaticPageForm from "@/components/cms/admin/AdminStaticPageForm";
import { createPageMetadata } from "@/lib/metadata";
import { staticPageService } from "@/services/static-page.service";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function humanizeSiteCode(siteCode: string) {
  return siteCode
    .trim()
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pageId = Number(id);

  if (!Number.isFinite(pageId)) {
    return createPageMetadata({
      title: "Chỉnh sửa trang tĩnh",
      description: "Chỉnh sửa nội dung HTML của trang tĩnh trong CMS Admin.",
      pathname: `/admin/quan-li-trang-tinh/${id}`,
    });
  }

  const page = await staticPageService.getById(pageId).catch(() => null);
  return createPageMetadata({
    title: page ? `Chỉnh sửa: ${humanizeSiteCode(page.siteCode)}` : "Chỉnh sửa trang tĩnh",
    description: "Chỉnh sửa nội dung HTML của trang tĩnh trong CMS Admin.",
    pathname: `/admin/quan-li-trang-tinh/${id}`,
  });
}

export default async function AdminStaticPageEditPage({ params }: PageProps) {
  const { id } = await params;
  const pageId = Number(id);

  if (!Number.isFinite(pageId)) {
    notFound();
  }

  const page = await staticPageService.getById(pageId).catch(() => null);
  if (!page) {
    notFound();
  }

  const submitAction = updateStaticPageAction.bind(null, pageId);

  return (
    <section className="layout-container layout-section-sm">
      <AdminStaticPageForm
        submitAction={submitAction}
        title="Chỉnh sửa trang tĩnh"
        description="Cập nhật site code, nội dung HTML và trạng thái hiển thị."
        submitLabel="Lưu thay đổi"
        defaultValues={{
          siteCode: page.siteCode,
          content: page.content ?? "",
          isPublished: page.isPublished,
        }}
        siteCodeReadOnly
      />
    </section>
  );
}
