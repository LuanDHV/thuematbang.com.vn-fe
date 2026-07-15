export interface Province {
  id: number;
  name: string;
  slug: string;
  code: string;
}

export interface Ward {
  id: number;
  name: string;
  slug: string;
  provinceId: number;
}
