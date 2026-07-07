import { Category } from "./category";
import { ContentStatus, PriceUnit } from "./enums";
import { Province, Ward } from "./location";
import { ProjectImage } from "./media";

export interface Project {
  id: number;
  displayCode?: string | null;
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
  priceAmount?: number | null;
  priceUnit?: PriceUnit | null;
  isNegotiable: boolean;
  content?: string | null;
  viewCount: number;
  status: ContentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category | null;
  province?: Province | null;
  ward?: Ward | null;
  images?: ProjectImage[];
}
