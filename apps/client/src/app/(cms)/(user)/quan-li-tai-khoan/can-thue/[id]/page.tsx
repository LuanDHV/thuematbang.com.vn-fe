import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
  title: "Chi tiết tin cần thuê",
  description: "Xem và chỉnh sửa tin cần thuê của bạn.",
  pathname: "/quan-li-tai-khoan/can-thue",
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
  const canEdit =
    rentRequest.status === "REJECTED" ||
    rentRequest.status === "PUBLISHED" ||
    rentRequest.status === "ARCHIVED";
  const isRejected = rentRequest.status === "REJECTED";
  const formMode = canEdit ? "user-edit-limited" : "view-only";
  const formTitle = canEdit
    ? `Chỉnh sửa tin cần thuê #${rentRequest.id}`
    : `Chi tiết tin cần thuê #${rentRequest.id}`;
  const formDescription = canEdit
    ? "Chỉnh sửa tin đăng sẽ tự động gửi lại trạng thái chờ duyệt."
    : "Chế độ xem chi tiết, không thể chỉnh sửa.";
  const headerAddon = isRejected ? (
    <div className="border-danger/20 bg-danger/5 text-danger rounded-xl border p-4 text-sm">
      <p className="font-semibold">Lý do từ chối</p>
      <p className="mt-1 whitespace-pre-line">{rentRequest.rejectReason}</p>
    </div>
  ) : null;

  return (
    <section className="layout-container layout-section-sm space-y-6">
      <RentRequestCreateForm
        categories={categories}
        provinces={provinces}
        submitAction={updateRentRequestAction.bind(null, rentRequest.id)}
        title={formTitle}
        description={formDescription}
        submitLabel={canEdit ? "Gửi lại duyệt" : "Lưu thay đổi"}
        mode={formMode}
        showSuccessDialog={false}
        headerAddon={headerAddon}
        defaultValues={{
          title: rentRequest.title,
          slug: rentRequest.slug,
          categoryId: rentRequest.categoryId,
          budgetAmount: rentRequest.budgetAmount ?? undefined,
          budgetUnit: rentRequest.budgetUnit ?? "MILLION",
          budget: rentRequest.budget ?? undefined,
          isNegotiable: rentRequest.isNegotiable,
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
          rejectReason: rentRequest.rejectReason ?? "",
        }}
      />
    </section>
  );
}
