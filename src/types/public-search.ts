export type PublicSearchResource = "property" | "rent-request";

export type PublicSearchSuggestionKind =
  | "category"
  | "location"
  | "category_location";

export type PublicSearchRouteParts = {
  categorySlug?: string;
  provinceSlug?: string;
  wardSlug?: string;
};

export type PublicSearchSuggestionDisplay = {
  categoryName?: string;
  provinceName?: string;
  wardName?: string;
};

export type PublicSearchSuggestion = {
  kind: PublicSearchSuggestionKind;
  label: string;
  targetResource: PublicSearchResource;
  flatSlug: string;
  routeParts: PublicSearchRouteParts;
  display: PublicSearchSuggestionDisplay;
};
