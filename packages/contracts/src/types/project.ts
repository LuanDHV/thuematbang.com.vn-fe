import type { ContentStatus } from "../enums/index.js";

export interface Project {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  developer?: string | null;
  priceAmount?: number | null;
  priceUnit?: import("../enums/index.js").PriceUnit | null;
  isNegotiable: boolean;
  area?: number | null;
  provinceId?: number | null;
  wardId?: number | null;
  addressDetail?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  content?: string | null;
  status: ContentStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}
