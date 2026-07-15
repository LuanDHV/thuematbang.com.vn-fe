import { Project } from "./project";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface Province {
  id: number;
  name: string;
  slug: string;
  wards?: Ward[];
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
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
}
