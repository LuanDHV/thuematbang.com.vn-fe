import { mockCategories } from "../../../mocks/categories";
import { HeaderClient } from "../client/HeaderClient";

// TODO: Replace mockCategories with API call when ready
// import { categoryService } from "@/services/category.service";
// const response = await categoryService.getAll();
// const categories = response.data || [];

export default async function Header() {
  // Using mockData for demo - replace with API call above when ready
  const categories = mockCategories;
  return <HeaderClient categories={categories} />;
}
