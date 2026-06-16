"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { propertyService } from "@/services/property.service";

function toPropertyId(id: string | number) {
  const parsedId = typeof id === "number" ? id : Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid property id");
  }
  return parsedId;
}

function normalizeBooleanField(formData: FormData, fieldName: string) {
  const values = formData.getAll(fieldName);
  if (!values.length) return;

  const normalized = values.some((value) => {
    if (typeof value !== "string") return false;
    const lowered = value.toLowerCase().trim();
    return lowered === "true" || lowered === "on" || lowered === "1";
  });

  formData.set(fieldName, normalized ? "true" : "false");
}

function normalizePropertyUpdateFormData(formData: FormData) {
  normalizeBooleanField(formData, "isNegotiable");
  normalizeBooleanField(formData, "isBoosted");
  normalizeBooleanField(formData, "isFeatured");
  return formData;
}

export async function deletePropertyAction(id: string | number) {
  const propertyId = toPropertyId(id);
  await propertyService.remove(propertyId);

  // Keep admin listing fresh after destructive mutations.
  revalidateTag("properties", "max");
  revalidateTag("my-properties", "max");
  revalidatePath("/admin/quan-li-tin-cho-thue");
}

export async function updatePropertyAction(
  id: string | number,
  formData: FormData,
) {
  const propertyId = toPropertyId(id);
  const result = await propertyService.update(
    propertyId,
    normalizePropertyUpdateFormData(formData),
  );

  // Update mutations should refresh both the admin list and the edit page shell.
  revalidateTag("properties", "max");
  revalidateTag("my-properties", "max");
  revalidateTag("property-detail", "max");
  revalidatePath("/admin/quan-li-tin-cho-thue");
  revalidatePath(`/admin/quan-li-tin-cho-thue/${propertyId}`);
  revalidatePath(`/admin/quan-li-tin-cho-thue/${propertyId}/edit`);
  return result;
}
