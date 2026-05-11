"use client";

import { Menu, SquarePlus, User } from "lucide-react";
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
    <header className="fixed top-0 right-0 left-0 z-50 bg-white/90 shadow-lg backdrop-blur-lg">
      <nav className="flex h-16 w-full items-center justify-center px-5 lg:h-20">
        <div className="relative flex w-full max-w-7xl items-center justify-between gap-6">
          {/* Left spacer - for mobile centering */}
          <div className="flex flex-1 lg:flex-none" />

          {/* Logo - centered on mobile, left on desktop */}
          <Link
            href={"/"}
            className="-trangray-x-1/2 -trangray-y-1/2 lg:trangray-x-0 lg:trangray-y-0 absolute top-1/2 left-1/2 lg:static"
          >
            <Image
              src="/imgs/brand-logo.png"
              alt="thuematbang.com.vn"
              width={280}
              height={80}
              priority
              className="h-14 w-auto object-contain lg:h-16"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex lg:flex-1 lg:justify-center">
            {parentCategories.length > 0 && (
              <>
                {parentCategories.map((parent) => (
                  <Link
                    key={parent.id}
                    href={`/${parent.slug}`}
                    className="hover:text-primary after:bg-primary relative rounded-md px-3 py-2 text-sm font-semibold tracking-wider text-gray-800 uppercase transition-colors after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100"
                  >
                    {parent.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none lg:justify-start">
            <Link href="#" className="hidden lg:inline">
              <Button
                size={"lg"}
                className="border-primary text-primary hover:border-primary hover:bg-primary/10 hover:-trangray-y-px cursor-pointer rounded-lg border bg-transparent px-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 ease-in-out"
              >
                <User className="h-5 w-5 object-cover" />
                Đăng nhập
              </Button>
            </Link>
            <Link href="#" className="hidden lg:inline">
              <Button
                size={"lg"}
                className="bg-primary hover:-trangray-y-px cursor-pointer rounded-lg px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:brightness-110"
              >
                <SquarePlus className="h-5 w-5 object-cover" />
                Đăng tin
              </Button>
            </Link>

            {/* Mobile Navigation */}
            <div className="absolute right-0 lg:static lg:hidden">
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
                          className="border-primary text-primary hover:border-primary hover:bg-primary/10 hover:-trangray-y-px w-full cursor-pointer rounded-lg border bg-transparent px-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 ease-in-out"
                        >
                          Đăng nhập
                          <User className="h-5 w-5 object-cover" />
                        </Button>
                      </Link>
                      <Link href="#" className="block">
                        <Button
                          size={"lg"}
                          className="bg-primary hover:-trangray-y-px w-full cursor-pointer rounded-lg px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:brightness-110"
                        >
                          Đăng tin
                          <SquarePlus className="h-5 w-5 object-cover" />
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
