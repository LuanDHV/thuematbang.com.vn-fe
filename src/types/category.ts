import { CategoryType } from "./enums";
import { News } from "./news";
import { Project } from "./project";
import { Property } from "./property";
import { RentRequest } from "./rent-request";

export interface Category {
  id: number;
  type: CategoryType;
  name: string;
  slug: string;
  priority: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  properties?: Property[];
  rentRequests?: RentRequest[];
  projects?: Project[];
  news?: News[];
}

// Legacy tree shape for current category navigation UI.
export interface CategoryTreeNode {
  id: number;
  type?: CategoryType;
  name: string;
  slug: string;
  priority?: number | null;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  parentId?: number | null;
  fullPath?: string | null;
  parent?: CategoryTreeNode | null;
  children?: CategoryTreeNode[];
}
