"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { KeyRound, LogOut, User } from "lucide-react";
import { useLogoutMutation } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { User as UserType } from "@/types";

const ACCOUNT_NAV_ITEMS = [
  {
    href: "/quan-li-tai-khoan/chinh-sua-thong-tin",
    label: "Hồ sơ cá nhân",
    icon: User,
  },
  {
    href: "/quan-li-tai-khoan/doi-mat-khau",
    label: "Đổi mật khẩu",
    icon: KeyRound,
  },
];

type AccountSidebarProps = {
  user: UserType;
};

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();

  return (
    <aside className="flex h-full min-h-160 flex-col rounded-2xl bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-6">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="Avatar người dùng"
            width={80}
            height={80}
            className="mx-auto h-20 w-20 rounded-full border border-gray-200 object-cover"
          />
        ) : (
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
            <User className="h-9 w-9" />
          </div>
        )}
        <p className="mt-3 text-center text-base font-semibold text-gray-900">
          {user.fullName || "Luân Vũ"}
        </p>
      </div>

      <nav className="flex-1 border-b border-gray-100 py-3">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-2 left-0 w-1 rounded-r",
                  isActive ? "bg-primary" : "bg-transparent",
                )}
              />
              <Icon
                className={cn("size-5", isActive ? "text-primary" : "text-gray-600")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-red-600"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="size-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
