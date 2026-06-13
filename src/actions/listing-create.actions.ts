"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { buildListingSlug } from "@/lib/listing-slug";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";
import type { PropertyDirection } from "@/types/enums";

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

function normalizePropertyDirection(
  value: FormDataEntryValue | null,
): PropertyDirection | null {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) return null;

  const allowedDirections: PropertyDirection[] = [
    "BAC",
    "DONG_BAC",
    "DONG",
    "DONG_NAM",
    "NAM",
    "TAY_NAM",
    "TAY",
    "TAY_BAC",
  ];

  return allowedDirections.includes(normalizedValue as PropertyDirection)
    ? (normalizedValue as PropertyDirection)
    : null;
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

  const title = String(nextFormData.get("title") ?? "").trim();
  const slug = String(nextFormData.get("slug") ?? "").trim();
  const categoryId = Number(nextFormData.get("categoryId"));
  const budget = Number(nextFormData.get("budget"));
  const desiredArea = Number(nextFormData.get("desiredArea"));
  const bedrooms = Number(nextFormData.get("bedrooms"));
  const bathrooms = Number(nextFormData.get("bathrooms"));
  const floors = Number(nextFormData.get("floors"));
  const desiredDirection = normalizePropertyDirection(
    nextFormData.get("desiredDirection"),
  );
  const desiredProvinceId = Number(nextFormData.get("desiredProvinceId"));
  const desiredWardId = Number(nextFormData.get("desiredWardId"));
  const contactName = String(nextFormData.get("contactName") ?? "").trim();
  const contactPhone = String(nextFormData.get("contactPhone") ?? "").trim();
  const requirementText = String(
    nextFormData.get("requirementText") ?? "",
  ).trim();

  return {
    title,
    slug,
    categoryId,
    budget,
    desiredArea,
    bedrooms: Number.isFinite(bedrooms) ? bedrooms : undefined,
    bathrooms: Number.isFinite(bathrooms) ? bathrooms : undefined,
    floors: Number.isFinite(floors) ? floors : undefined,
    desiredDirection,
    desiredProvinceId,
    desiredWardId,
    contactName,
    contactPhone,
    requirementText: requirementText || undefined,
  };
}

export async function createPropertyAction(formData: FormData) {
  const result = await propertyService.create(
    normalizePropertyPayload(formData),
  );

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
