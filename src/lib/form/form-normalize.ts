import { buildListingSlug } from "@/lib/listing/listing-slug";

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
  const budgetAmountValue = Number(nextFormData.get("budgetAmount"));
  const budgetValue = Number(nextFormData.get("budget"));

  if (!Number.isFinite(budgetAmountValue) && Number.isFinite(budgetValue)) {
    nextFormData.set("budgetAmount", String(budgetValue / 1_000_000));
  }

  if (!String(nextFormData.get("budgetUnit") ?? "").trim()) {
    nextFormData.set("budgetUnit", "MILLION");
  }

  return nextFormData;
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
