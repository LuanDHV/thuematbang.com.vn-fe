"use client";

import { Category } from "@/types/category";
import { mockCategories } from "../../mocks/categories";

interface CategoryProps {
  onSelectCategory?: (categorySlug: string) => void;
  selectedCategorySlug?: string | null;
}

export default function TinTucCategory({
  onSelectCategory,
  selectedCategorySlug,
}: CategoryProps) {
  // Find tin tuc category by slug
  const tintucCategory = mockCategories.find((cat) => cat.slug === "tin-tuc");

  if (!tintucCategory || !tintucCategory.children) {
    return <div className="text-gray-500">Không có danh mục</div>;
  }

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold">Danh mục tin tức</h3>
      <div className="flex flex-wrap gap-3">
        {/* Parent category button */}
        <button
          onClick={() => onSelectCategory?.(tintucCategory.slug)}
          className={`cursor-pointer rounded-xl px-4 py-2 font-medium transition ${
            selectedCategorySlug === tintucCategory.slug
              ? "bg-primary text-white"
              : "border-primary text-primary hover:bg-primary/10 border bg-white"
          }`}
        >
          {tintucCategory.name}
        </button>

        {/* Subcategory buttons */}
        {tintucCategory.children.map((category: Category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory?.(category.slug)}
            className={`cursor-pointer rounded-xl px-4 py-2 font-medium transition ${
              selectedCategorySlug === category.slug
                ? "bg-primary text-white"
                : "border-primary text-primary hover:bg-primary/10 border bg-white"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
