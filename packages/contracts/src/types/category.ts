import type { CategoryType } from "../enums/index.js";

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: CategoryType;
  priority: number;
  isActive: boolean;
  parentId?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CategoryTreeNode extends Category {
  children?: CategoryTreeNode[];
}
