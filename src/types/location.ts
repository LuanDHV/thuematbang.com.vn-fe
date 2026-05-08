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
  id: number;
  districtId: number;
  name: string;
  slug: string;
  district?: District;
}
