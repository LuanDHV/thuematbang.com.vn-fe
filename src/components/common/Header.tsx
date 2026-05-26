"use client";
import { Menu, SquarePlus, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUIStore } from "@/stores/ui-store";
import { useAuthMe } from "@/hooks/use-auth";

const HEADER_ITEMS = [
  { id: "cho-thue", name: "Cho thuê", href: "/cho-thue" },
  { id: "can-thue", name: "Cần thuê", href: "/can-thue" },
  { id: "du-an", name: "Dự án", href: "/du-an" },
  { id: "tin-tuc", name: "Tin tức", href: "/tin-tuc" },
];

export default function Header() {
  const { data: authUser } = useAuthMe();
  const displayName = authUser?.fullName || authUser?.email || "Tài khoản";
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow backdrop-blur-lg">
      <nav className="flex h-16 w-full items-center justify-center px-5">
        <div className="relative flex w-full max-w-7xl items-center justify-between gap-6">
          <div className="flex flex-1 lg:flex-none" />

          <Link
            href="/"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0"
          >
            <Image
              src="/imgs/brand-logo.png"
              alt="thuematbang.com.vn"
              width={280}
              height={80}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex lg:flex-1 lg:justify-center">
            {HEADER_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="hover:text-primary after:bg-primary relative rounded-md px-3 py-2 text-sm font-semibold tracking-wider text-gray-700 uppercase transition-colors after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none lg:justify-start">
            {authUser ? (
              <div className="border-primary/25 text-primary hidden items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-semibold lg:inline-flex">
                <User className="h-5 w-5 object-cover" />
                <span className="max-w-36 truncate">{displayName}</span>
              </div>
            ) : (
              <Button
                asChild
                size="lg"
                className="border-primary text-primary hover:border-primary hover:bg-primary/10 hidden cursor-pointer rounded-xl border bg-transparent px-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 ease-in-out hover:-translate-y-px lg:inline-flex"
              >
                <Link href="/dang-nhap">
                  <User className="h-5 w-5 object-cover" />
                  Đăng nhập
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              className="bg-primary hidden cursor-pointer rounded-xl px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-px hover:brightness-110 lg:inline-flex"
            >
              <Link href="#">
                <SquarePlus className="h-5 w-5 object-cover" />
                Đăng tin
              </Link>
            </Button>

            <div className="absolute right-0 lg:static lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-lg">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-64 bg-white"
                  srTitle="Menu điều hướng"
                >
                  <div className="mt-6 space-y-5 px-5">
                    <div className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                      Danh mục
                    </div>
                    <div className="space-y-2">
                      {HEADER_ITEMS.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="hover:text-primary block rounded-md px-2 py-1 text-sm font-semibold tracking-wide text-gray-700 uppercase transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-200/80 pt-3" />
                    <div className="space-y-2">
                      {authUser ? (
                        <div className="border-primary/25 text-primary flex w-full items-center justify-between rounded-xl border bg-white px-4 py-2 text-sm font-semibold">
                          <span className="truncate">{displayName}</span>
                          <User className="h-5 w-5 object-cover" />
                        </div>
                      ) : (
                        <Button
                          asChild
                          size="lg"
                          className="border-primary text-primary hover:border-primary hover:bg-primary/10 w-full cursor-pointer rounded-xl border bg-transparent px-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 ease-in-out hover:-translate-y-px"
                        >
                          <Link href="/dang-nhap" onClick={closeMobileMenu}>
                            Đăng nhập
                            <User className="h-5 w-5 object-cover" />
                          </Link>
                        </Button>
                      )}
                      <Button
                        asChild
                        size="lg"
                        className="bg-primary w-full cursor-pointer rounded-xl px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-px hover:brightness-110"
                      >
                        <Link href="#" onClick={closeMobileMenu}>
                          Đăng tin
                          <SquarePlus className="h-5 w-5 object-cover" />
                        </Link>
                      </Button>
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

