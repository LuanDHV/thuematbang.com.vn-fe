import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updatePropertyAction } from "@/actions/property.actions";
import { PropertyCreateForm } from "@/components/listing-form/PropertyCreateForm";
import { createPageMetadata } from "@/lib/metadata";
import { mapPropertyImagesToGalleryImages } from "@/lib/listing/listing-form";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { propertyService } from "@/services/property.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chi tiết tin cho thuê",
  description: "Xem và chỉnh sửa tin cho thuê của bạn.",
  pathname: "/quan-li-tai-khoan/cho-thue",
});

export default async function UserPropertyEditPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    notFound();
  }

  let property;
  try {
    property = await propertyService.getById(propertyId);
  } catch {
    notFound();
  }

  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "PROPERTY",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const categories = categoriesResponse.data ?? [];
  const canEdit =
    property.status === "REJECTED" ||
    property.status === "PUBLISHED" ||
    property.status === "ARCHIVED";
  const isRejected = property.status === "REJECTED";
  const formMode = canEdit ? "user-edit-limited" : "view-only";
  const formTitle = canEdit
    ? `Chỉnh sửa tin cho thuê #${property.id}`
    : `Chi tiết tin cho thuê #${property.id}`;
  const formDescription = canEdit
    ? "Chỉnh sửa tin đăng sẽ gửi lại trạng thái chờ duyệt."
    : "Chế độ xem chi tiết, không thể chỉnh sửa.";
  const headerAddon = isRejected ? (
    <div className="border-danger/20 bg-danger/5 text-danger rounded-xl border p-4 text-sm">
      <p className="font-semibold">Lý do từ chối</p>
      <p className="mt-1 whitespace-pre-line">{property.rejectReason}</p>
    </div>
  ) : null;

  return (
    <section className="layout-container layout-section-sm space-y-6">
      <PropertyCreateForm
        categories={categories}
        provinces={provinces}
        submitAction={updatePropertyAction.bind(null, property.id)}
        title={formTitle}
        description={formDescription}
        submitLabel={canEdit ? "Gửi lại duyệt" : "Lưu thay đổi"}
        mode={formMode}
        showSuccessDialog={false}
        resourceId={property.id}
        headerAddon={headerAddon}
        existingImages={mapPropertyImagesToGalleryImages(property.images)}
        defaultValues={{
          title: property.title,
          slug: property.slug,
          categoryId: property.categoryId,
          priceAmount: property.priceAmount ?? undefined,
          priceUnit: property.priceUnit ?? "MILLION",
          isNegotiable: property.isNegotiable,
          area: property.area,
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          floors: property.floors ?? undefined,
          direction: property.direction ?? null,
          provinceId: property.provinceId,
          wardId: property.wardId ?? undefined,
          contactName: property.contactName,
          contactPhone: property.contactPhone,
          addressDetail: property.addressDetail ?? "",
          longitude: property.longitude ?? undefined,
          latitude: property.latitude ?? undefined,
          content: property.content ?? "",
          status: property.status,
          rejectReason: property.rejectReason ?? "",
        }}
      />
    </section>
  );
}
