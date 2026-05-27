"use client";

import { useState } from "react";
import { LogOut, Menu, Settings, SquarePlus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthMe, useLogoutMutation } from "@/hooks/use-auth";
import { useUIStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const HEADER_ITEMS = [
  { id: "cho-thue", name: "Cho thuê", href: "/cho-thue" },
  { id: "can-thue", name: "Cần thuê", href: "/can-thue" },
  { id: "du-an", name: "Dự án", href: "/du-an" },
  { id: "tin-tuc", name: "Tin tức", href: "/tin-tuc" },
];

export default function Header() {
  const router = useRouter();
  const { data: authUser } = useAuthMe();
  const logoutMutation = useLogoutMutation();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const displayName = authUser?.fullName || authUser?.email || "Tài khoản";
  const avatarUrl = authUser?.avatarUrl?.trim() || "";
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  async function handleLogout() {
    if (logoutMutation.isPending) return;

    setUserMenuOpen(false);
    try {
      await logoutMutation.mutateAsync();
    } finally {
      closeMobileMenu();
      router.refresh();
      router.push("/");
    }
  }

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
                className="hover:text-primary after:bg-primary text-body relative rounded-md px-3 py-2 text-sm font-semibold tracking-wider uppercase transition-colors after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none lg:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-primary hidden cursor-pointer rounded-xl border border-transparent px-4 text-sm font-semibold tracking-wide text-white uppercase shadow-md transition-all duration-300 ease-in-out hover:-translate-y-px hover:shadow-lg hover:brightness-110 lg:inline-flex"
            >
              <Link href="#">
                Đăng tin
                <SquarePlus className="h-5 w-5 object-cover" />
              </Link>
            </Button>
            {authUser ? (
              <Popover open={isUserMenuOpen} onOpenChange={setUserMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    className="hidden size-9 items-center justify-center rounded-full bg-transparent p-0 shadow transition-all duration-200 lg:inline-flex"
                    aria-label="Tài khoản người dùng"
                  >
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-secondary inline-flex size-8 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  sideOffset={10}
                  className="w-56 min-w-56 rounded-2xl border-gray-200 p-2 shadow-2xl"
                >
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/quan-li-tai-khoan"
                      onClick={() => setUserMenuOpen(false)}
                      className="hover:bg-primary/10 hover:text-primary flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      Quản lí tài khoản
                      <Settings className="size-5" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="hover:bg-primary/10 hover:text-primary flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {logoutMutation.isPending
                        ? "Đang đăng xuất..."
                        : "Đăng xuất"}
                      <LogOut className="size-5" />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                asChild
                size="lg"
                className="border-primary/60 text-primary hover:border-primary hover:bg-primary/10 hidden cursor-pointer rounded-xl border bg-white px-4 text-sm font-semibold tracking-wide uppercase shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-px hover:text-white hover:shadow-md lg:inline-flex"
              >
                <Link href="/dang-nhap">
                  Đăng nhập
                  <User className="h-5 w-5 object-cover" />
                </Link>
              </Button>
            )}

            <div className="absolute right-0 lg:static lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-lg">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 bg-white"
                  srTitle="Menu điều hướng"
                >
                  <div className="mt-6 flex flex-col gap-5 px-5">
                    <div className="text-xs font-bold tracking-[0.18em] text-gray-400 uppercase">
                      Danh mục
                    </div>
                    <div className="flex flex-col gap-2">
                      {HEADER_ITEMS.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="hover:text-primary hover:bg-primary/5 text-body block rounded-lg px-3 py-2 text-sm font-semibold tracking-wide uppercase transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-200/80 pt-4" />
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        size="lg"
                        className="border-primary/60 bg-primary hover:border-primary w-full justify-between rounded-xl border px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-px hover:brightness-110"
                      >
                        <Link href="#" onClick={closeMobileMenu}>
                          Đăng tin
                          <SquarePlus className="h-5 w-5 object-cover" />
                        </Link>
                      </Button>
                      {authUser ? (
                        <div className="flex flex-col gap-2">
                          <Button
                            asChild
                            size="lg"
                            variant="ghost"
                            className="hover:border-primary hover:bg-primary/5 hover:text-primary text-body w-full justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-px"
                          >
                            <Link
                              href="/quan-li-tai-khoan"
                              onClick={closeMobileMenu}
                            >
                              Quản lí tài khoản
                              <Settings className="h-5 w-5 object-cover" />
                            </Link>
                          </Button>
                          <Button
                            size="lg"
                            variant="ghost"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="hover:border-primary hover:bg-primary/5 hover:text-primary text-body w-full cursor-pointer justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-px"
                          >
                            {logoutMutation.isPending
                              ? "Đang đăng xuất..."
                              : "Đăng xuất"}
                            <LogOut className="h-5 w-5 object-cover" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          asChild
                          size="lg"
                          className="hover:border-primary hover:bg-primary/5 text-body w-full justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold tracking-wide shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-px hover:text-white"
                        >
                          <Link href="/dang-nhap" onClick={closeMobileMenu}>
                            Đăng nhập
                            <User className="h-5 w-5 object-cover" />
                          </Link>
                        </Button>
                      )}
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
