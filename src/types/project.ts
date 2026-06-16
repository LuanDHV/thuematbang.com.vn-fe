import { Category } from "./category";
import { PublishStatus } from "./enums";
import { Province, Ward } from "./location";
import { ProjectImage } from "./media";

export interface Project {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  developer?: string | null;
  provinceId?: number | null;
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
  province?: Province | null;
  ward?: Ward | null;
  images?: ProjectImage[];
}
