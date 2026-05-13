export interface AdvancedFilterValue {
  propertyTypes: string[];
  city: string;
  ward: string;
  street: string;
  priceMin: string;
  priceMax: string;
  negotiable: boolean;
  areaMin: string;
  areaMax: string;
  bedrooms: string[];
  bathrooms: string[];
  directions: string[];
}

export const INITIAL_ADVANCED_FILTER_VALUE: AdvancedFilterValue = {
  propertyTypes: [],
  city: "",
  ward: "",
  street: "",
  priceMin: "",
  priceMax: "",
  negotiable: false,
  areaMin: "",
  areaMax: "",
  bedrooms: [],
  bathrooms: [],
  directions: [],
};
