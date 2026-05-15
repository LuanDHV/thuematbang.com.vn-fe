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
  area?: number | null;
  price?: number | null;
  content?: string | null;
  viewCount?: number | null;
  status?: PublishStatus | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  category?: Category | null;
  city?: City | null;
  district?: District | null;
  ward?: Ward | null;
  images?: ProjectImage[];
  // Legacy fields kept for compatibility.
  overviewContent?: string | null;
  locationContent?: string | null;
  facilitiesContent?: string | null;
  paymentContent?: string | null;
  progressContent?: string | null;
}
