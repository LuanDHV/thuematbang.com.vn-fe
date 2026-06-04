"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminListToolbarProps = {
  eyebrow: string;
  searchPlaceholder: string;
  actionLabel?: string;
  onActionClick?: () => void;
  searchValue?: string;
  hiddenParams?: Array<{
    name: string;
    value: string;
  }>;
};

const SEARCH_DEBOUNCE_MS = 350;

export default function AdminListToolbar({
  eyebrow,
  searchPlaceholder,
  actionLabel,
  onActionClick,
  searchValue,
  hiddenParams,
}: AdminListToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftValue, setDraftValue] = useState(searchValue ?? "");

  const hiddenParamsValue = useMemo(() => hiddenParams ?? [], [hiddenParams]);

  const buildSearchHref = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      if (nextValue.trim()) {
        params.set("q", nextValue.trim());
      } else {
        params.delete("q");
      }

      for (const field of hiddenParamsValue) {
        params.set(field.name, field.value);
      }

      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [hiddenParamsValue, pathname, searchParams],
  );

  useEffect(() => {
    const href = buildSearchHref(draftValue);
    const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (href === currentHref) {
      return;
    }

    const handle = window.setTimeout(() => {
      router.replace(href);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [buildSearchHref, draftValue, pathname, router, searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const href = buildSearchHref(draftValue);

    if (
      href !==
      `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    ) {
      router.replace(href);
    }
  };

  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              {eyebrow}
            </p>
          </div>

          <form className="flex justify-between gap-3" onSubmit={handleSubmit}>
            {hiddenParamsValue.map((field) => (
              <input
                key={`${field.name}-${field.value}`}
                type="hidden"
                name={field.name}
                value={field.value}
              />
            ))}

            <div className="relative min-w-0 sm:w-80">
              <Search className="text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                name="q"
                type="search"
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Bộ lọc"
              >
                <Filter className="size-4" />
              </Button>
              {actionLabel ? (
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5"
                  onClick={onActionClick}
                  disabled={!onActionClick}
                >
                  <Plus className="size-4" />
                  {actionLabel}
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
