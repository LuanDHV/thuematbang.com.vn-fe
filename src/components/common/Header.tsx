import { categoryService } from "@/services/category.service";
import { HeaderClient } from "../client/HeaderClient";

export default async function Header() {
  const response = await categoryService.getAll();
  const categories = response.data || [];
  return <HeaderClient categories={categories} />;
}
