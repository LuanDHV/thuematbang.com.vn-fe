"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { buildListingSlug } from "@/lib/listing-slug";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";

function cloneFormData(formData: FormData) {
  const nextFormData = new FormData();

  for (const [key, value] of formData.entries()) {
    nextFormData.append(key, value);
  }

  return nextFormData;
}

function normalizeListingSlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const currentSlug = String(formData.get("slug") ?? "");
  const nextSlug = buildListingSlug(currentSlug || title);

  formData.set("slug", nextSlug);
}

function normalizeBooleanLike(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

function normalizePropertyPayload(formData: FormData) {
  const nextFormData = cloneFormData(formData);
  normalizeListingSlug(nextFormData);
  const isNegotiableFromForm = normalizeBooleanLike(
    nextFormData.get("isNegotiable"),
  );
  nextFormData.set("isNegotiable", isNegotiableFromForm ? "true" : "false");

  return nextFormData;
}

function normalizeRentRequestPayload(formData: FormData) {
  const nextFormData = cloneFormData(formData);
  normalizeListingSlug(nextFormData);
  return nextFormData;
}

export async function createPropertyAction(formData: FormData) {
  const result = await propertyService.create(normalizePropertyPayload(formData));

  revalidateTag("properties", "max");
  revalidateTag("my-properties", "max");
  revalidatePath("/cho-thue");
  revalidatePath("/dang-tin/cho-thue");
  revalidatePath("/quan-li-tai-khoan/cho-thue");
  revalidatePath("/admin/quan-li-tin-cho-thue");

  return result;
}

export async function createRentRequestAction(formData: FormData) {
  const result = await rentRequestService.create(
    normalizeRentRequestPayload(formData),
  );

  revalidateTag("rent-requests", "max");
  revalidateTag("my-rent-requests", "max");
  revalidatePath("/can-thue");
  revalidatePath("/dang-tin/can-thue");
  revalidatePath("/quan-li-tai-khoan/cau-thue");
  revalidatePath("/admin/quan-li-tin-can-thue");

  return result;
}
