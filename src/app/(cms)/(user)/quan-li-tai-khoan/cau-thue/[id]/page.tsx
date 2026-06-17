import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateRentRequestAction } from "@/actions/admin-crud.actions";
import { RentRequestCreateForm } from "@/components/listing-form/RentRequestCreateForm";
import { createPageMetadata } from "@/lib/metadata";
import { categoryService } from "@/services/category.service";
import { locationService } from "@/services/location.service";
import { rentRequestService } from "@/services/rent-request.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa tin cần thuê",
  description: "Cập nhật tin cần thuê của bạn.",
  pathname: "/quan-li-tai-khoan/cau-thue",
});

export default async function UserRentRequestEditPage({ params }: PageProps) {
  const { id } = await params;
  const rentRequestId = Number(id);

  if (!Number.isInteger(rentRequestId) || rentRequestId <= 0) {
    notFound();
  }

  let rentRequest;
  try {
    rentRequest = await rentRequestService.getById(rentRequestId);
  } catch {
    notFound();
  }

  const [categoriesResponse, provinces] = await Promise.all([
    categoryService.getAll({
      filters: {
        type: "RENT_REQUEST",
      },
      revalidate: 300,
    }),
    locationService.getProvinces(),
  ]);

  const categories = categoriesResponse.data ?? [];

  return (
    <section className="layout-container layout-section-sm">
      <RentRequestCreateForm
        categories={categories}
        provinces={provinces}
        submitAction={updateRentRequestAction.bind(null, rentRequest.id)}
        title={`Chỉnh sửa tin cần thuê #${rentRequest.id}`}
        description="Chỉnh sửa nhu cầu thuê của bạn."
        submitLabel="Lưu thay đổi"
        mode="user-edit-limited"
        showSuccessDialog={false}
        defaultValues={{
          title: rentRequest.title,
          slug: rentRequest.slug,
          categoryId: rentRequest.categoryId,
          budget: rentRequest.budget,
          desiredArea: rentRequest.desiredArea,
          bedrooms: rentRequest.bedrooms ?? undefined,
          bathrooms: rentRequest.bathrooms ?? undefined,
          floors: rentRequest.floors ?? undefined,
          desiredDirection: rentRequest.desiredDirection ?? null,
          desiredProvinceId: rentRequest.desiredProvinceId,
          desiredWardId: rentRequest.desiredWardId ?? undefined,
          contactName: rentRequest.contactName,
          contactPhone: rentRequest.contactPhone,
          requirementText: rentRequest.requirementText ?? "",
          status: rentRequest.status,
          isMatched: rentRequest.isMatched,
        }}
      />
    </section>
  );
}
