import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateProjectAction } from "@/actions/admin-crud.actions";
import AdminProjectForm from "@/components/cms/admin/AdminProjectForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { projectService } from "@/services/project.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa dự án",
  description: "Cập nhật dự án trong CMS Admin.",
  pathname: "/admin/quan-li-du-an",
});

export default async function AdminProjectEditPage({ params }: PageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound();
  }

  let project;
  try {
    project = await projectService.getById(projectId);
  } catch {
    notFound();
  }

  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "PROJECT",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <AdminProjectForm
        categories={categories}
        provinces={provinces}
        submitAction={updateProjectAction.bind(null, project.id)}
        title={`Chỉnh sửa dự án #${project.id}`}
        description="Cập nhật dữ liệu dự án trong CMS."
        submitLabel="Lưu thay đổi"
        requireImages={false}
        resourceId={project.id}
        existingImages={
          project.images?.map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            sortOrder: image.sortOrder,
            imagePublicId: image.imagePublicId ?? null,
          })) ?? []
        }
        defaultValues={{
          name: project.name,
          slug: project.slug,
          categoryId: project.categoryId ?? undefined,
          developer: project.developer ?? "",
          provinceId: project.provinceId ?? undefined,
          wardId: project.wardId ?? undefined,
          addressDetail: project.addressDetail ?? "",
          longitude: project.longitude ?? undefined,
          latitude: project.latitude ?? undefined,
          area: project.area ?? undefined,
          priceAmount: project.priceAmount ?? undefined,
          priceUnit: project.priceUnit ?? "MILLION",
          content: project.content ?? "",
          status: project.status,
        }}
      />
    </section>
  );
}
