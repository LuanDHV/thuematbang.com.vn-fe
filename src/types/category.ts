export interface Category {
  id: string | number;
  parentId: string | number | null;
  name: string;
  slug: string;
  fullPath?: string;
  priority?: number;
  isActive?: boolean;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}
