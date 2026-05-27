"use client";

import { useState } from "react";
import { LogOut, Menu, Settings, SquarePlus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CloudinaryImage from "@/components/common/CloudinaryImage";
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
    <header className="bg-app/92 fixed top-0 right-0 left-0 z-50 border-b border-black/6 backdrop-blur-xl">
      <nav className="layout-container flex h-16 items-center justify-center">
        <div className="relative flex w-full items-center justify-between gap-6">
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
                className="text-heading hover:text-primary after:bg-primary relative rounded-lg px-3 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors after:absolute after:right-3 after:bottom-1.5 after:left-3 after:h-px after:origin-center after:scale-x-0 after:rounded-full after:transition-transform hover:after:scale-x-100"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 lg:flex-none lg:justify-start">
            <Button asChild size="lg" className="hidden lg:inline-flex">
              <Link href="#">
                Đăng tin
                <SquarePlus className="size-5" />
              </Link>
            </Button>
            {authUser ? (
              <Popover open={isUserMenuOpen} onOpenChange={setUserMenuOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden size-10 rounded-full p-0 lg:inline-flex"
                    aria-label="Tài khoản người dùng"
                  >
                    {avatarUrl ? (
                      <CloudinaryImage
                        src={avatarUrl}
                        alt={displayName}
                        width={36}
                        height={36}
                        cldQuality="auto:best"
                        className="size-9 rounded-full object-cover ring-1 ring-black/5"
                      />
                    ) : (
                      <span className="text-secondary flex size-9 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                        <User className="size-5" />
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  sideOffset={10}
                  className="w-56 min-w-56 p-2"
                >
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/quan-li-tai-khoan"
                      onClick={() => setUserMenuOpen(false)}
                      className="text-body hover:bg-primary/8 hover:text-primary flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                    >
                      Quản lý tài khoản
                      <Settings className="size-5" />
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="text-body hover:bg-primary/8 hover:text-primary flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
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
                variant="outline"
                className="hidden lg:inline-flex"
              >
                <Link href="/dang-nhap">
                  Đăng nhập
                  <User className="size-5" />
                </Link>
              </Button>
            )}

            <div className="absolute right-0 lg:static lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon-lg" aria-label="Mở menu">
                    <Menu className="size-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72"
                  srTitle="Menu điều hướng"
                >
                  <div className="mt-6 flex flex-col gap-5 px-5">
                    <div className="text-muted text-xs font-semibold tracking-[0.18em] uppercase">
                      Danh mục
                    </div>
                    <div className="flex flex-col gap-2">
                      {HEADER_ITEMS.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="text-heading hover:bg-primary/6 hover:text-primary block rounded-lg px-3 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-black/6 pt-4" />
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        size="lg"
                        className="w-full justify-between"
                      >
                        <Link href="#" onClick={closeMobileMenu}>
                          Đăng tin
                          <SquarePlus className="size-5" />
                        </Link>
                      </Button>
                      {authUser ? (
                        <div className="flex flex-col gap-2">
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <Link
                              href="/quan-li-tai-khoan"
                              onClick={closeMobileMenu}
                            >
                              Quản lý tài khoản
                              <Settings className="size-5" />
                            </Link>
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                            className="w-full justify-between"
                          >
                            {logoutMutation.isPending
                              ? "Đang đăng xuất..."
                              : "Đăng xuất"}
                            <LogOut className="size-5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <Link href="/dang-nhap" onClick={closeMobileMenu}>
                            Đăng nhập
                            <User className="size-5" />
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
