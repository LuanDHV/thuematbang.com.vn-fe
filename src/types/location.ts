export interface City {
  id: number;
  name: string;
  slug: string;
}

export interface District {
  id: number;
  cityId: number;
  name: string;
  slug: string;
  city?: City;
}

export interface Ward {
  cityId?: number;
  id: number;
  districtId: number;
  name: string;
  slug: string;
  district?: District;
}

export interface Street {
  id: number;
  cityId: number;
  districtId: number;
  wardId?: number | null;
  name: string;
  slug: string;
  city?: City;
  district?: District;
  ward?: Ward | null;
}
