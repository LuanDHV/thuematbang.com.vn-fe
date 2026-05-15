import { Category } from "./category";
import { City, District, Ward } from "./location";
import { ProjectImage } from "./media";
import { PublishStatus } from "./enums";

export interface Project {
  id: number;
  name: string;
  slug: string;
  categoryId?: number | null;
  developer?: string | null;
  cityId?: number | null;
  districtId?: number | null;
  wardId?: number | null;
  addressDetail?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  area?: number | null;
  price?: number | null;
  content?: string | null;
  viewCount: number;
  status: PublishStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category | null;
  city?: City | null;
  district?: District | null;
  ward?: Ward | null;
  images?: ProjectImage[];
}

