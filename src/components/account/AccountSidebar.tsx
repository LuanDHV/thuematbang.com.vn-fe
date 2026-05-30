"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, LogOut, User } from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";

const ACCOUNT_NAV_ITEMS = [
  {
    href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
    label: "Hồ sơ cá nhân",
    icon: User,
  },
] as const;

type AccountSidebarProps = {
  user: UserType;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "ND";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const userInitials = getInitials(user.fullName);
  const hasPassword = user.hasPassword ?? true;
  const passwordItemLabel = hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu";
  const passwordItemHref = "/quan-li-tai-khoan/doi-mat-khau";

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white">
      <div className="px-4 py-5 md:px-5">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/60 p-3">
          {user.avatarUrl ? (
            <CloudinaryImage
              src={user.avatarUrl}
              alt={`Ảnh đại diện của ${user.fullName || "người dùng"}`}
              width={56}
              height={56}
              cldQuality="auto:best"
              className="size-14 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
              <span className="text-sm font-semibold text-heading">{userInitials}</span>
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">
              {user.fullName || "Người dùng"}
            </p>
            {user.email ? <p className="truncate text-xs text-secondary">{user.email}</p> : null}
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 pb-3">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                isActive
                  ? "border-l-primary bg-primary/5"
                  : "border-l-transparent hover:bg-gray-50",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  isActive ? "text-primary" : "text-secondary group-hover:text-heading",
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  isActive ? "font-semibold text-heading" : "text-body",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <Link
          href={passwordItemHref}
          className={cn(
            "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            pathname === passwordItemHref
              ? "border-l-primary bg-primary/5"
              : "border-l-transparent hover:bg-gray-50",
          )}
        >
          <KeyRound
            className={cn(
              "size-4",
              pathname === passwordItemHref
                ? "text-primary"
                : "text-secondary group-hover:text-heading",
            )}
          />
          <span
            className={cn(
              "text-sm",
              pathname === passwordItemHref ? "font-semibold text-heading" : "text-body",
            )}
          >
            {passwordItemLabel}
          </span>
        </Link>
      </nav>

      <div className="border-t border-gray-200 px-4 py-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full justify-start rounded-xl border-gray-200 px-4 text-body hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="size-4" />
          {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>
    </aside>
  );
}
