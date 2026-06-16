"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { buildListingSlug } from "@/lib/listing-slug";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";
import {
  PROPERTY_DIRECTION_VALUES,
  PUBLISH_STATUS_VALUES,
} from "@/constants/enum-values";
import type { PropertyDirection, PublishStatus } from "@/types/enums";

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

  return PROPERTY_DIRECTION_VALUES.includes(normalizedValue as PropertyDirection)
    ? (normalizedValue as PropertyDirection)
    : null;
}

function normalizeRentRequestStatus(
  value: FormDataEntryValue | null,
): PublishStatus | undefined {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) return undefined;

  return PUBLISH_STATUS_VALUES.includes(normalizedValue as PublishStatus)
    ? (normalizedValue as PublishStatus)
    : undefined;
}

function normalizePropertyPayload(formData: FormData) {
  const nextFormData = cloneFormData(formData);
  normalizeListingSlug(nextFormData);
  const booleanFields = [
    "isNegotiable",
    "isBoosted",
    "isFeatured",
  ] as const;

  for (const fieldName of booleanFields) {
    const isTrue = normalizeBooleanLike(nextFormData.get(fieldName));
    nextFormData.set(fieldName, isTrue ? "true" : "false");
  }

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
  const userIdValue = Number(nextFormData.get("userId"));
  const status = normalizeRentRequestStatus(nextFormData.get("status"));
  const isMatched =
    nextFormData.get("isMatched") === "true" ||
    nextFormData.get("isMatched") === "on" ||
    nextFormData.get("isMatched") === "1";

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
    userId: Number.isFinite(userIdValue) ? userIdValue : undefined,
    status,
    isMatched,
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
