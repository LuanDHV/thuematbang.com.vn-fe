"use client";

import { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/types/category";

interface HeaderClientProps {
  categories: Category[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  const [openMenus, setOpenMenus] = useState<Record<string | number, boolean>>(
    {},
  );
  const [hoveredMenu, setHoveredMenu] = useState<string | number | null>(null);

  const toggleMenu = (id: string | number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get only parent categories (parentId === null)
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  console.log(categories);

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Image
              src="/imgs/logo-thuematbang.png"
              alt="thuematbang.com.vn"
              width={180}
              height={80}
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 font-semibold md:flex">
            <Link href="/" className="hover:text-primary px-3 py-2">
              Trang chủ
            </Link>

            {parentCategories.length > 0 && (
              <>
                {parentCategories.map((parent) => (
                  <div
                    key={parent.id}
                    className="relative"
                    onMouseEnter={() => setHoveredMenu(parent.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <button className="hover:text-primary flex items-center px-3 py-2">
                      {parent.name}
                      {parent.children && parent.children.length > 0 && (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {parent.children &&
                      parent.children.length > 0 &&
                      hoveredMenu === parent.id && (
                        <div className="absolute top-full left-0 mt-0 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200">
                          <Link
                            href={`/category/${parent.slug}`}
                            className="hover:bg-primary/10 hover:text-primary block border-b px-4 py-2 text-sm text-gray-700"
                          ></Link>
                          {parent.children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/category/${child.fullPath}`}
                              className="hover:bg-primary/10 hover:text-primary block px-4 py-2 text-sm text-gray-700"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:inline">
              <Button className="bg-primary hover:bg-primary/90">
                Đăng nhập
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="mt-8 space-y-4">
                    <Link
                      href="/"
                      className="block text-lg font-medium text-gray-900"
                    >
                      Trang chủ
                    </Link>

                    {parentCategories.length > 0 && (
                      <div className="space-y-2">
                        {parentCategories.map((parent) => (
                          <div key={parent.id}>
                            <button
                              onClick={() => toggleMenu(parent.id)}
                              className="hover:text-primary flex w-full items-center justify-between text-lg font-medium text-gray-900"
                            >
                              <span>{parent.name}</span>
                              {parent.children &&
                                parent.children.length > 0 && (
                                  <ChevronDown
                                    className={`h-5 w-5 transition-transform ${
                                      openMenus[parent.id] ? "rotate-180" : ""
                                    }`}
                                  />
                                )}
                            </button>

                            {parent.children &&
                              parent.children.length > 0 &&
                              openMenus[parent.id] && (
                                <div className="border-primary mt-2 ml-4 space-y-1 border-l-2 pl-2">
                                  <Link
                                    href={`/category/${parent.slug}`}
                                    className="hover:text-primary block py-1 text-sm text-gray-600"
                                  >
                                    Xem tất cả
                                  </Link>
                                  {parent.children.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/category/${child.fullPath}`}
                                      className="hover:text-primary block py-1 text-sm text-gray-600"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 border-t pt-4">
                      <Link href="/login" className="block">
                        <Button className="bg-primary hover:bg-primary/90 w-full">
                          Đăng nhập
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
