"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";

const ACCOUNT_NAV_ITEMS = [
  {
    href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
    label: "Hồ sơ cá nhân",
    description: "Quản lý thông tin hiển thị trong tài khoản",
    icon: User,
  },
  {
    href: "/quan-li-tai-khoan/doi-mat-khau",
    label: "Đổi mật khẩu",
    description: "Tăng cường bảo mật cho tài khoản",
    icon: KeyRound,
  },
] as const;

type AccountSidebarProps = {
  user: UserType;
};

function getInitials(name?: string | null) {
  if (!name) {
    return "ND";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const userInitials = getInitials(user.fullName);

  return (
    <aside className="flex h-full min-h-160 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-primary px-5 py-6 text-white">
        <div className="absolute right-0 top-0 size-28 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 size-24 -translate-x-8 translate-y-8 rounded-full bg-primary-foreground/10 blur-2xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
              <Building2 className="size-4" />
              Trung tâm tài khoản
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              <ShieldCheck className="size-4" />
              An toàn
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <CloudinaryImage
                src={user.avatarUrl}
                alt={`Ảnh đại diện của ${user.fullName || "người dùng"}`}
                width={88}
                height={88}
                cldQuality="auto:best"
                className="size-20 rounded-full border-4 border-white/20 object-cover shadow-sm"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full border-4 border-white/15 bg-white/10 shadow-sm">
                <span className="text-xl font-semibold tracking-wide text-white">
                  {userInitials}
                </span>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/70">Tài khoản thành viên</p>
              <p className="truncate text-lg font-semibold text-white">
                {user.fullName || "Người dùng"}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Quản lý hồ sơ và bảo mật trong một nơi.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {user.email ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80">
                <Mail className="size-4 shrink-0 text-white/70" />
                <span className="truncate">{user.email}</span>
              </div>
            ) : null}

            {user.phone ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/80">
                <Phone className="size-4 shrink-0 text-white/70" />
                <span>{user.phone}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 px-4 py-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-heading">
            Quản lý hồ sơ bất động sản
          </p>
          <p className="mt-1 text-sm text-secondary">
            Giữ thông tin cá nhân đầy đủ để tăng độ tin cậy khi khách hàng xem
            tin và gửi liên hệ.
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/15",
                isActive
                  ? "border-primary/20 bg-primary/10 shadow-sm"
                  : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-secondary group-hover:bg-primary/10 group-hover:text-primary",
                )}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-primary" : "text-heading",
                  )}
                >
                  {item.label}
                </p>
                <p className="truncate text-xs text-secondary">
                  {item.description}
                </p>
              </div>

              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  isActive
                    ? "text-primary"
                    : "text-gray-300 group-hover:translate-x-0.5 group-hover:text-secondary",
                )}
              />
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 px-4 py-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start rounded-2xl border-gray-200 px-4 text-body hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="size-5" />
          {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>
    </aside>
  );
}
