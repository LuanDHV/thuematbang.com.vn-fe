import type { ExistingGalleryImage } from "@/components/listing-form/ListingImageGalleryField";
import type { ProjectFormValues } from "@/schemas/admin-crud.schema";
import type {
  PropertyCreateFormValues,
  RentRequestCreateFormValues,
} from "@/schemas/listing-create.schema";
import type { Property } from "@/types/property";

function toOptionalNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function normalizeGalleryImages(
  images?: ExistingGalleryImage[] | null,
): ExistingGalleryImage[] {
  return [...(images ?? [])]
    .filter((image) => Boolean(image))
    .sort((left, right) => {
      const leftOrder = left.sortOrder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.sortOrder ?? Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.id - right.id;
    });
}

export function mapPropertyImagesToGalleryImages(
  images?: Property["images"] | null,
): ExistingGalleryImage[] {
  return normalizeGalleryImages(
    images?.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      sortOrder: image.sortOrder,
      imagePublicId: image.imagePublicId ?? null,
    })),
  );
}

export function normalizePropertyCreateDefaults(
  defaultValues?: Partial<PropertyCreateFormValues>,
): Partial<PropertyCreateFormValues> {
  if (!defaultValues) {
    return {};
  }

  return {
    ...defaultValues,
    categoryId: toOptionalNumber(defaultValues.categoryId),
    price: toOptionalNumber(defaultValues.price),
    area: toOptionalNumber(defaultValues.area),
    bedrooms: toOptionalNumber(defaultValues.bedrooms),
    bathrooms: toOptionalNumber(defaultValues.bathrooms),
    floors: toOptionalNumber(defaultValues.floors),
    provinceId: toOptionalNumber(defaultValues.provinceId),
    wardId: toOptionalNumber(defaultValues.wardId),
    longitude: toOptionalNumber(defaultValues.longitude),
    latitude: toOptionalNumber(defaultValues.latitude),
    boostCount: toOptionalNumber(defaultValues.boostCount),
    userId: toOptionalNumber(defaultValues.userId),
  };
}

export function normalizeProjectFormDefaults(
  defaultValues?: Partial<ProjectFormValues>,
): Partial<ProjectFormValues> {
  if (!defaultValues) {
    return {};
  }

  return {
    ...defaultValues,
    categoryId: toOptionalNumber(defaultValues.categoryId),
    provinceId: toOptionalNumber(defaultValues.provinceId),
    wardId: toOptionalNumber(defaultValues.wardId),
    longitude: toOptionalNumber(defaultValues.longitude),
    latitude: toOptionalNumber(defaultValues.latitude),
    area: toOptionalNumber(defaultValues.area),
    price: toOptionalNumber(defaultValues.price),
  };
}

export function normalizeRentRequestFormDefaults(
  defaultValues?: Partial<RentRequestCreateFormValues>,
): Partial<RentRequestCreateFormValues> {
  if (!defaultValues) {
    return {};
  }

  return {
    ...defaultValues,
    categoryId: toOptionalNumber(defaultValues.categoryId),
    budget: toOptionalNumber(defaultValues.budget),
    desiredArea: toOptionalNumber(defaultValues.desiredArea),
    bedrooms: toOptionalNumber(defaultValues.bedrooms),
    bathrooms: toOptionalNumber(defaultValues.bathrooms),
    floors: toOptionalNumber(defaultValues.floors),
    desiredProvinceId: toOptionalNumber(defaultValues.desiredProvinceId),
    desiredWardId: toOptionalNumber(defaultValues.desiredWardId),
    userId: toOptionalNumber(defaultValues.userId),
    isMatched: Boolean(defaultValues.isMatched),
  };
}
