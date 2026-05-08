export interface Category {
  id: number;
  parentId?: number | null;
  name: string;
  slug: string;
  fullPath?: string | null;
  priority?: number | null;
  isActive?: boolean | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  parent?: Category | null;
  children?: Category[];
}
