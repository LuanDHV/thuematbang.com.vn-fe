import { buildListingSlug } from "@/lib/listing/listing-slug";
import {
  PROPERTY_DIRECTION_VALUES,
  PUBLISH_STATUS_VALUES,
} from "@/constants/enum-values";
import type { PropertyDirection, PublishStatus } from "@/types/enums";

export function toPositiveId(id: string | number) {
  const parsedId = typeof id === "number" ? id : Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error("Invalid id");
  }
  return parsedId;
}

export function cloneFormData(formData: FormData) {
  const nextFormData = new FormData();

  for (const [key, value] of formData.entries()) {
    nextFormData.append(key, value);
  }

  return nextFormData;
}

export function normalizeBooleanLike(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "1";
}

export function normalizeBooleanField(formData: FormData, fieldName: string) {
  const values = formData.getAll(fieldName);
  if (!values.length) return;

  const normalized = values.some((value) => {
    if (typeof value !== "string") return false;
    const lowered = value.toLowerCase().trim();
    return lowered === "true" || lowered === "on" || lowered === "1";
  });

  formData.set(fieldName, normalized ? "true" : "false");
}

export function normalizeSlugField(
  formData: FormData,
  sourceField: string,
  targetField: string,
) {
  const sourceValue = String(formData.get(sourceField) ?? "").trim();
  const currentSlug = String(formData.get(targetField) ?? "").trim();
  if (currentSlug) return;

  formData.set(targetField, sourceValue);
}

export function normalizeListingSlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const currentSlug = String(formData.get("slug") ?? "");
  const nextSlug = buildListingSlug(currentSlug || title);

  formData.set("slug", nextSlug);
}

export function normalizePropertyDirection(
  value: FormDataEntryValue | null,
): PropertyDirection | null {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) return null;

  return PROPERTY_DIRECTION_VALUES.includes(normalizedValue as PropertyDirection)
    ? (normalizedValue as PropertyDirection)
    : null;
}

export function normalizeRentRequestStatus(
  value: FormDataEntryValue | null,
): PublishStatus | undefined {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) return undefined;

  return PUBLISH_STATUS_VALUES.includes(normalizedValue as PublishStatus)
    ? (normalizedValue as PublishStatus)
    : undefined;
}

export function normalizePropertyPayload(formData: FormData) {
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

export function normalizePropertyUpdateFormData(formData: FormData) {
  normalizeBooleanField(formData, "isNegotiable");
  normalizeBooleanField(formData, "isBoosted");
  normalizeBooleanField(formData, "isFeatured");
  return formData;
}

export function normalizeRentRequestPayload(formData: FormData) {
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

export function toOptionalNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
