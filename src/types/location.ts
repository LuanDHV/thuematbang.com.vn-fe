import { Project } from "./project";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface City {
  id: number;
  name: string;
  slug: string;
  districts?: District[];
  wards?: Ward[];
  streets?: Street[];
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
}

export interface District {
  id: number;
  cityId: number;
  name: string;
  slug: string;
  city?: City;
  wards?: Ward[];
  streets?: Street[];
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
}

export interface Ward {
  id: number;
  cityId: number;
  districtId: number;
  name: string;
  slug: string;
  city?: City;
  district?: District;
  streets?: Street[];
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
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
  properties?: Property[];
  rentRequests?: RentRequest[];
}
