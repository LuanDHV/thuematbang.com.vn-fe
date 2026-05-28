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

export interface CategoryTreeNode extends Omit<Category, "type"> {
  parentId?: number;
  fullPath?: string;
  children?: CategoryTreeNode[];
}


