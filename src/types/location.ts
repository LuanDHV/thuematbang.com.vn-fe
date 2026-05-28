import { Project } from "./project";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface Province {
  id: number;
  name: string;
  slug: string;
  wards?: Ward[];
  streets?: Street[];
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
}

export interface Ward {
  id: number;
  provinceId: number;
  name: string;
  slug: string;
  province?: Province;
  streets?: Street[];
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
}

export interface Street {
  id: number;
  provinceId: number;
  wardId?: number | null;
  name: string;
  slug: string;
  province?: Province;
  ward?: Ward | null;
  properties?: Property[];
  rentRequests?: RentRequest[];
}
