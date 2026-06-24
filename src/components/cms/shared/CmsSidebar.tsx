"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SheetClose } from "@/components/ui/sheet";
import { useLogoutMutation } from "@/hooks/use-auth";
import {
  buildCmsHomeNavItem,
  type CmsNavItem,
} from "@/lib/navigation/cms-navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import type { User } from "@/types";

type CmsSidebarProps = {
  user: User;
  items: CmsNavItem[];
  className?: string;
  forceExpanded?: boolean;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "ND";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
}

function TooltipWrap({
  children,
  enabled,
  label,
}: {
  children: ReactNode;
  enabled: boolean;
  label: string;
}) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function CmsSidebar({
  user,
  items,
  className,
  forceExpanded = false,
}: CmsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isCmsSidebarCollapsed = useUIStore(
    (state) => state.isCmsSidebarCollapsed,
  );
  const toggleCmsSidebarCollapsed = useUIStore(
    (state) => state.toggleCmsSidebarCollapsed,
  );
  const logoutMutation = useLogoutMutation();
  const initials = getInitials(user.fullName);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const desktopExpanded = forceExpanded || !isCmsSidebarCollapsed;
  const railMode = forceExpanded
    ? false
    : !isDesktopViewport || isCmsSidebarCollapsed;
  const accountLabel = user.fullName || "Người dùng";
  const accountDescription = user.email || user.role;
  const accountTooltip = `${accountLabel}${
    accountDescription ? ` - ${accountDescription}` : ""
  }`;
  const logoutLabel = logoutMutation.isPending
    ? "Đang đăng xuất..."
    : "Đăng xuất";
  const navItems = [buildCmsHomeNavItem(), ...items];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
    } finally {
      router.refresh();
      router.push("/");
    }
  };

  const avatar = user.avatarUrl ? (
    <CloudinaryImage
      src={user.avatarUrl}
      alt={`Ảnh đại diện của ${accountLabel}`}
      width={48}
      height={48}
      cldQuality="auto:best"
      className="border-hairline size-12 shrink-0 rounded-full border object-cover"
    />
  ) : (
    <div className="bg-surface border-hairline flex size-12 shrink-0 items-center justify-center rounded-full border lg:size-14">
      <span className="text-heading text-xs font-semibold lg:text-sm">
        {initials}
      </span>
    </div>
  );

  const accountRailButton = (
    <button
      type="button"
      className="focus-visible:ring-primary/20 rounded-full focus-visible:ring-2 focus-visible:outline-none"
      aria-label={accountLabel}
    >
      {avatar}
    </button>
  );

  const logoutRailButton = (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="rounded-xl lg:size-9"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      aria-label={logoutLabel}
    >
      <LogOut className="size-4" />
    </Button>
  );

  return (
    <TooltipProvider delayDuration={120}>
      <aside
        className={cn(
          "bg-surface flex h-full flex-col overflow-hidden",
          className,
        )}
      >
        <div className="border-hairline hidden border-b p-3 lg:block">
          <div
            className={cn(
              "flex",
              desktopExpanded
                ? "items-center justify-between"
                : "flex-col items-center gap-2",
            )}
          >
            <div
              className={cn(
                "min-w-0",
                desktopExpanded ? "flex-1" : "flex items-center justify-center",
              )}
            >
              {desktopExpanded ? (
                <div className="flex items-center gap-3">
                  {avatar}
                  <div className="min-w-0">
                    <p className="text-secondary text-[0.68rem] font-semibold tracking-[0.2em] uppercase">
                      {user.role}
                    </p>
                    <p className="text-heading truncate text-sm font-semibold">
                      {accountLabel}
                    </p>
                    {user.email ? (
                      <p className="text-secondary truncate text-xs">
                        {user.email}
                      </p>
                    ) : (
                      <p className="text-secondary text-xs">
                        Bảng điều hướng quản trị
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex justify-center">
                  <TooltipWrap enabled={true} label={accountTooltip}>
                    {accountRailButton}
                  </TooltipWrap>
                </div>
              )}
            </div>

            <div className="shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl"
                onClick={toggleCmsSidebarCollapsed}
                aria-label={
                  desktopExpanded
                    ? "Thu gọn thanh điều hướng CMS"
                    : "Mở rộng thanh điều hướng CMS"
                }
                aria-pressed={desktopExpanded}
              >
                {desktopExpanded ? (
                  <ChevronLeft className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-hairline border-b p-3",
            forceExpanded ? "" : "lg:hidden",
          )}
        >
          <div
            className={cn(
              "flex",
              desktopExpanded
                ? "items-center justify-between"
                : "justify-center",
            )}
          >
            {desktopExpanded ? (
              <div className="flex items-center gap-3">
                {avatar}
                <div className="min-w-0">
                  <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                    {user.role}
                  </p>
                  <p className="text-heading truncate text-sm font-semibold">
                    {accountLabel}
                  </p>
                  {user.email ? (
                    <p className="text-secondary truncate text-xs">
                      {user.email}
                    </p>
                  ) : (
                    <p className="text-secondary text-xs">
                      Bảng điều hướng quản trị
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <TooltipWrap enabled={true} label={accountTooltip}>
                {accountRailButton}
              </TooltipWrap>
            )}

            {!forceExpanded ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-xl"
                onClick={toggleCmsSidebarCollapsed}
                aria-label={
                  desktopExpanded
                    ? "Thu gọn thanh điều hướng CMS"
                    : "Mở rộng thanh điều hướng CMS"
                }
                aria-pressed={desktopExpanded}
              >
                {desktopExpanded ? (
                  <ChevronLeft className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            ) : null}
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 py-3 lg:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

            const navLink = (
              <Link
                href={item.href}
                aria-label={railMode ? item.label : undefined}
                className={cn(
                  "group focus-visible:ring-primary/20 flex rounded-xl border py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  forceExpanded
                    ? "items-center justify-start gap-3 px-3"
                    : "justify-center px-0",
                  !forceExpanded &&
                    desktopExpanded &&
                    "lg:items-center lg:justify-start lg:gap-3 lg:px-3",
                  isActive
                    ? "border-primary/14 bg-primary/6 shadow-[0_10px_20px_rgba(15,23,42,0.04)]"
                    : "hover:bg-subtle/70 border-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "size-[1.1rem] shrink-0 lg:size-4",
                    isActive
                      ? "text-primary"
                      : "text-secondary group-hover:text-heading",
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    isActive ? "text-heading font-semibold" : "text-body",
                    !forceExpanded && !desktopExpanded && "sr-only",
                    !forceExpanded && desktopExpanded && "lg:not-sr-only",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );

            return (
              <TooltipWrap
                key={item.href}
                enabled={railMode}
                label={item.label}
              >
                {forceExpanded ? (
                  <SheetClose asChild>{navLink}</SheetClose>
                ) : (
                  navLink
                )}
              </TooltipWrap>
            );
          })}
        </nav>

        <div className="border-hairline mt-auto border-t p-3">
          {forceExpanded ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-start rounded-xl px-4"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="size-4" />
              {logoutLabel}
            </Button>
          ) : (
            <>
              <div className="hidden lg:block">
                {desktopExpanded ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full justify-start rounded-xl px-4"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="size-4" />
                    {logoutLabel}
                  </Button>
                ) : (
                  <div className="flex justify-center">
                    <TooltipWrap enabled={true} label={logoutLabel}>
                      {logoutRailButton}
                    </TooltipWrap>
                  </div>
                )}
              </div>

              <div className="flex justify-center lg:hidden">
                <TooltipWrap enabled={true} label={logoutLabel}>
                  {logoutRailButton}
                </TooltipWrap>
              </div>
            </>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
