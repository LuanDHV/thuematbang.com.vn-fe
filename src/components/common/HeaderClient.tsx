"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "@/types/category";

interface HeaderClientProps {
  categories: Category[];
}

export function HeaderClient({ categories }: HeaderClientProps) {
  // Get only parent categories (parentId === null)
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-md">
      <nav className="flex h-16 w-full items-center justify-center px-4 sm:px-6 lg:h-20 lg:px-8">
        <div className="relative flex w-full max-w-7xl items-center justify-between gap-6">
          {/* Logo - centered on mobile, left on desktop */}
          <Link
            href={"/"}
            className="flex flex-1 justify-center md:flex-none md:justify-start"
          >
            <Image
              src="/imgs/logo-thuematbang.png"
              alt="thuematbang.com.vn"
              width={200}
              height={80}
              className="h-16 w-auto object-cover lg:h-20"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {parentCategories.length > 0 && (
              <>
                {parentCategories.map((parent) => (
                  <Link
                    key={parent.id}
                    href={`/${parent.slug}`}
                    className="hover:text-primary after:bg-primary relative rounded-md px-3 py-2 text-xs font-semibold tracking-wide text-gray-800 uppercase transition-colors after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100"
                  >
                    {parent.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="#" className="hidden sm:inline">
              <Button
                size={"lg"}
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary cursor-pointer border-2 bg-white text-xs font-semibold tracking-wide uppercase duration-200 ease-in-out"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link href="#" className="hidden sm:inline">
              <Button
                size={"lg"}
                className="bg-primary hover:bg-primary/90 cursor-pointer text-xs font-semibold tracking-wide text-white uppercase duration-200 ease-in-out"
              >
                Đăng tin
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <div className="absolute right-0 md:static md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-lg">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 bg-white">
                  <div className="mt-6 space-y-5 px-5">
                    <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                      Danh mục
                    </div>
                    {parentCategories.length > 0 && (
                      <div className="space-y-2">
                        {parentCategories.map((parent) => (
                          <Link
                            key={parent.id}
                            href={`/${parent.slug}`}
                            className="hover:text-primary block rounded-md px-2 py-1 text-sm font-semibold tracking-wide text-gray-800 uppercase transition-colors"
                          >
                            {parent.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-gray-200/80 pt-3" />
                    <div className="space-y-2">
                      <Link href="#" className="block">
                        <Button
                          size={"lg"}
                          className="border-primary text-primary hover:bg-primary/10 hover:text-primary w-full cursor-pointer border-2 bg-white text-xs font-semibold tracking-wide uppercase duration-200 ease-in-out"
                        >
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link href="#" className="block">
                        <Button
                          size={"lg"}
                          className="bg-primary hover:bg-primary/90 w-full cursor-pointer text-xs font-semibold tracking-wide text-white uppercase duration-200 ease-in-out"
                        >
                          Đăng tin
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
