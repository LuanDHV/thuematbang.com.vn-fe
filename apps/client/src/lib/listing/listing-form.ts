import type { ExistingGalleryImage } from "@/types/gallery";
import type { ProjectFormValues } from "@/schemas/admin-crud.schema";
import type {
  PropertyCreateFormValues,
  RentRequestCreateFormValues,
} from "@/schemas/listing-create.schema";
import type { Property } from "@/types/property";
import { toOptionalNumber } from "@/lib/form/form-normalize";

function derivePriceAmount(
  amount?: number | null,
  legacyPrice?: number | null,
) {
  const normalizedAmount = toOptionalNumber(amount);
  if (typeof normalizedAmount === "number") {
    return normalizedAmount;
  }

  const normalizedLegacyPrice = toOptionalNumber(legacyPrice);
  if (typeof normalizedLegacyPrice === "number") {
    return normalizedLegacyPrice / 1_000_000;
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

export function hasGalleryImageOrderChanged(
  initialImages: ExistingGalleryImage[],
  currentImages: ExistingGalleryImage[],
) {
  if (initialImages.length !== currentImages.length) {
    return true;
  }

  return currentImages.some(
    (image, index) => image.id !== initialImages[index]?.id,
  );
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
    priceAmount: derivePriceAmount(
      defaultValues.priceAmount,
      defaultValues.price,
    ),
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
    priceAmount: derivePriceAmount(
      defaultValues.priceAmount,
      defaultValues.price,
    ),
    price: toOptionalNumber(defaultValues.price),
    isNegotiable: Boolean(defaultValues.isNegotiable),
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
    budgetAmount: derivePriceAmount(
      defaultValues.budgetAmount,
      defaultValues.budget,
    ),
    budget: toOptionalNumber(defaultValues.budget),
    desiredArea: toOptionalNumber(defaultValues.desiredArea),
    bedrooms: toOptionalNumber(defaultValues.bedrooms),
    bathrooms: toOptionalNumber(defaultValues.bathrooms),
    floors: toOptionalNumber(defaultValues.floors),
    desiredProvinceId: toOptionalNumber(defaultValues.desiredProvinceId),
    desiredWardId: toOptionalNumber(defaultValues.desiredWardId),
    userId: toOptionalNumber(defaultValues.userId),
    isMatched: Boolean(defaultValues.isMatched),
    isNegotiable: Boolean(defaultValues.isNegotiable),
  };
}
