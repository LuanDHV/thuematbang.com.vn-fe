import { CategoryType } from "./enums";

export interface Category {
  id: number;
  type?: CategoryType;
  name: string;
  slug: string;
  priority?: number | null;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  // Legacy fields kept for compatibility with current UI mocks/components.
  parentId?: number | null;
  fullPath?: string | null;
  parent?: Category | null;
  children?: Category[];
}
