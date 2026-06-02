"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import type { CmsNavItem } from "./cms-navigation";

type CmsSidebarProps = {
  user: User;
  items: CmsNavItem[];
  className?: string;
  footer?: ReactNode;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "ND";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
}

export default function CmsSidebar({
  user,
  items,
  className,
  footer,
}: CmsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const initials = getInitials(user.fullName);

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
    } finally {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <aside className={cn("bg-surface flex h-full flex-col overflow-hidden", className)}>
      <div className="border-hairline flex items-center gap-2 border-b p-3">
        {user.avatarUrl ? (
          <CloudinaryImage
            src={user.avatarUrl}
            alt={`Ảnh đại diện của ${user.fullName || "người dùng"}`}
            width={56}
            height={56}
            cldQuality="auto:best"
            className="border-hairline size-14 rounded-full border object-cover"
          />
        ) : (
          <div className="bg-surface border-hairline flex size-14 items-center justify-center rounded-full border">
            <span className="text-heading text-sm font-semibold">
              {initials}
            </span>
          </div>
        )}

        <div className="min-w-0">
          <p className="text-primary text-sm font-semibold tracking-widest">
            {user.role}
          </p>
          <p className="text-heading truncate text-sm font-semibold">
            {user.fullName || "Người dùng"}
          </p>

          {user.email ? (
            <p className="text-secondary truncate text-xs">{user.email}</p>
          ) : null}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group focus-visible:ring-primary/20 flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                isActive
                  ? "border-l-primary bg-primary/5"
                  : "hover:bg-subtle border-l-transparent",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  isActive
                    ? "text-primary"
                    : "text-secondary group-hover:text-heading",
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  isActive ? "text-heading font-semibold" : "text-body",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-5">
        {footer ?? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full justify-start rounded-xl px-4"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
          </Button>
        )}
      </div>
    </aside>
  );
}
