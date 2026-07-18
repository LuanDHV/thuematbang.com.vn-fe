import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SkeletonBlock({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-subtle animate-pulse rounded-lg", className)}
      {...props}
    />
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <SkeletonBlock
      data-testid="image-skeleton"
      className={cn("absolute inset-0 h-full w-full rounded-none", className)}
    />
  );
}

export function ListingCardSkeleton({
  variant = "property",
}: {
  variant?: "property" | "rentRequest" | "project" | "news";
}) {
  const isNews = variant === "news";

  return (
    <article
      className={cn(
        "surface-utility flex h-full overflow-hidden",
        isNews ? "flex-col md:flex-row" : "flex-col",
      )}
    >
      <div
        className={cn(
          "bg-surface-alt relative shrink-0 overflow-hidden",
          isNews ? "aspect-16/10 w-full md:w-2/5" : "h-48 w-full",
        )}
      >
        <ImageSkeleton />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <SkeletonBlock className="h-4 w-2/5 rounded-full" />
        <SkeletonBlock className="h-5 w-full" />
        <SkeletonBlock className="h-5 w-4/5" />
        <SkeletonBlock className="h-4 w-3/5" />
        <div className="border-hairline mt-auto flex items-center justify-between border-t border-dashed pt-3">
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="h-3 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
}

export function ListingPageSkeleton({
  variant = "property",
  count = 8,
}: {
  variant?: "property" | "rentRequest" | "project" | "news";
  count?: number;
}) {
  const gridClass =
    variant === "news"
      ? "grid grid-cols-1 gap-5"
      : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="layout-container layout-section-sm pb-0">
      <div className="flex flex-col gap-4" data-testid="listing-page-skeleton">
        <SkeletonBlock className="h-8 w-64 max-w-full" />
        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <div className={gridClass}>
          {Array.from({ length: count }, (_, index) => (
            <ListingCardSkeleton
              key={`listing-card-skeleton-${index}`}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
