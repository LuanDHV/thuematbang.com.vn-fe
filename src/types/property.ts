import { Category } from "./category";
import { City, District, Ward } from "./location";
import { User } from "./user";
import { Project } from "./project";

export interface Property {
  id: number;
  userId?: number;
  projectId?: number | null;
  title: string;
  slug: string;
  categoryId?: number | null;
  price?: number | null;
  area?: number | null;
  thumbnailUrl?: string | null;
  direction?: string | null;
  numFloors?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  legalStatus?: string | null;
  cityId?: number | null;
  districtId?: number | null;
  wardId?: number | null;
  addressDetail?: string | null;
  content?: string | null;
  status?: string | null;
  isFeatured?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  user?: User;
  project?: Project | null;
  category?: Category | null;
  city?: City | null;
  district?: District | null;
  ward?: Ward | null;
}
