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

export function normalizeListingSlug(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const currentSlug = String(formData.get("slug") ?? "");
  const nextSlug = buildListingSlug(currentSlug || title);

  formData.set("slug", nextSlug);
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
