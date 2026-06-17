import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updatePropertyAction } from "@/actions/property.actions";
import { PropertyCreateForm } from "@/components/listing-form/PropertyCreateForm";
import { mapPropertyImagesToGalleryImages } from "@/lib/listing/listing-form";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { propertyService } from "@/services/property.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa tin cho thuê",
  description: "Cập nhật tin cho thuê của bạn.",
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

  return (
    <section className="layout-container layout-section-sm">
      <PropertyCreateForm
        categories={categories}
        provinces={provinces}
        submitAction={updatePropertyAction.bind(null, property.id)}
        title={`Chỉnh sửa tin cho thuê #${property.id}`}
        description="Chỉnh sửa tin đăng của bạn với bộ field giới hạn."
        submitLabel="Lưu thay đổi"
        mode="user-edit-limited"
        showSuccessDialog={false}
        existingImages={mapPropertyImagesToGalleryImages(property.images)}
        defaultValues={{
          title: property.title,
          slug: property.slug,
          categoryId: property.categoryId,
          price: property.price,
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
        }}
      />
    </section>
  );
}
