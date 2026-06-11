"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, ChevronRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Province, Ward } from "@/types/location";
import type { AdminTableToolbar } from "./data-table";

type AdminLocationsTableProps = {
  provinces: Province[];
  wards: Ward[];
  selectedProvince?: Province | null;
  selectedWard?: Ward | null;
  searchValue?: string;
  toolbar?: AdminTableToolbar;
};

type QueryValue = string | number | null | undefined;

type DrilldownColumn<TData> = {
  key: string;
  header: string;
  className?: string;
  render: (row: TData) => ReactNode;
};

type LocationDrilldownTableProps<TData extends { id: number }> = {
  data: TData[];
  columns: DrilldownColumn<TData>[];
  emptyTitle: string;
  emptyDescription: string;
  header?: ReactNode;
  onSelect?: (row: TData) => void;
  actionLabel?: string;
};

const SEARCH_DEBOUNCE_MS = 350;

function LocationDrilldownTable<TData extends { id: number }>({
  data,
  columns,
  emptyTitle,
  emptyDescription,
  header,
  onSelect,
  actionLabel,
}: LocationDrilldownTableProps<TData>) {
  return (
    <div className="surface-panel overflow-hidden">
      {header ? (
        <div className="border-hairline border-b px-3 py-3 md:px-4">
          {header}
        </div>
      ) : null}

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="cursor-default hover:bg-transparent">
              <TableHead className="w-20">ID</TableHead>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {onSelect ? (
                <TableHead className="w-40 text-right">Điều hướng</TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    onSelect
                      ? "cursor-pointer"
                      : "cursor-default hover:bg-transparent",
                  )}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  onClick={onSelect ? () => onSelect(row) : undefined}
                  onKeyDown={
                    onSelect
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            onSelect(row);
                          }
                        }
                      : undefined
                  }
                >
                  <TableCell className="text-secondary text-xs font-medium">
                    {row.id}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.key}`}
                      className={column.className}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {onSelect ? (
                    <TableCell className="text-right">
                      <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                        {actionLabel}
                        <ChevronRight className="size-4" />
                      </span>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            ) : (
              <TableRow className="cursor-default hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + (onSelect ? 2 : 1)}
                  className="py-12 text-center"
                >
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      {emptyTitle}
                    </p>
                    <p className="text-secondary text-sm">{emptyDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {data.length > 0 ? (
          data.map((row) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                      ID {row.id}
                    </p>
                  </div>

                  {onSelect ? (
                    <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                      {actionLabel}
                      <ChevronRight className="size-4" />
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {columns.map((column) => (
                    <div key={`${row.id}-${column.key}`} className="space-y-1">
                      <p className="text-secondary text-xs font-medium">
                        {column.header}
                      </p>
                      <div className="text-body text-sm">
                        {column.render(row)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );

            if (!onSelect) {
              return (
                <article
                  key={row.id}
                  className="surface-card space-y-4 p-4 text-left"
                >
                  {content}
                </article>
              );
            }

            return (
              <button
                key={row.id}
                type="button"
                className="surface-card w-full space-y-4 p-4 text-left"
                onClick={() => onSelect(row)}
              >
                {content}
              </button>
            );
          })
        ) : (
          <div className="surface-card px-4 py-10 text-center">
            <div className="space-y-2">
              <p className="text-heading text-base font-semibold">
                {emptyTitle}
              </p>
              <p className="text-secondary text-sm">{emptyDescription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLocationsTable({
  provinces,
  wards,
  selectedProvince,

  searchValue,
  toolbar,
}: AdminLocationsTableProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalSearchValue = toolbar?.searchValue ?? searchValue ?? "";
  const [draftState, setDraftState] = useState({
    source: externalSearchValue,
    value: externalSearchValue,
  });
  const draftValue =
    draftState.source === externalSearchValue
      ? draftState.value
      : externalSearchValue;

  const hasSearch = Boolean(toolbar?.searchPlaceholder);
  const hasDraftSearchChange = draftValue !== externalSearchValue;

  const buildSearchHref = useCallback(
    (nextValue: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      if (nextValue.trim()) {
        params.set("q", nextValue.trim());
      } else {
        params.delete("q");
      }

      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  useEffect(() => {
    if (!hasSearch) return;
    if (!hasDraftSearchChange) return;

    const href = buildSearchHref(draftValue);
    const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (href === currentHref) return;

    const handle = window.setTimeout(() => {
      router.replace(href);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [
    buildSearchHref,
    draftValue,
    hasDraftSearchChange,
    hasSearch,
    pathname,
    router,
    searchParams,
  ]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasSearch) return;

    const href = buildSearchHref(draftValue);
    const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (href !== currentHref) {
      router.replace(href);
    }
  };

  const navigateToProvince = (provinceId?: QueryValue) => {
    const params = new URLSearchParams(searchParams);

    if (searchValue) {
      params.set("q", searchValue);
    } else {
      params.delete("q");
    }

    if (provinceId) {
      params.set("provinceId", String(provinceId));
    } else {
      params.delete("provinceId");
    }

    params.delete("wardId");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const provinceColumns = useMemo<DrilldownColumn<Province>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        render: (province) => (
          <div className="space-y-1">
            <p className="font-medium">{province.name}</p>
            <p className="text-secondary text-xs">Nhấn để xem phường/xã</p>
          </div>
        ),
      },
      {
        key: "slug",
        header: "Slug",
        render: (province) => province.slug,
      },
    ],
    [],
  );

  const wardColumns = useMemo<DrilldownColumn<Ward>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        render: (ward) => (
          <div className="space-y-1">
            <p className="font-medium">{ward.name}</p>
            <p className="text-secondary text-xs">
              Thuộc {selectedProvince?.name}
            </p>
          </div>
        ),
      },
      {
        key: "slug",
        header: "Slug",
        render: (ward) => ward.slug,
      },
    ],
    [selectedProvince?.name],
  );

  const levelMeta = selectedProvince
    ? {
        eyebrow: "Level 2",
        title: "Phường / Xã",
        description: `Danh sách phường/xã thuộc ${selectedProvince.name}.`,
        emptyTitle: "Không có phường/xã",
        emptyDescription:
          "Chưa có bản ghi phường/xã cho tỉnh/thành này hoặc kết quả tìm kiếm không khớp.",
      }
    : {
        eyebrow: "Level 1",
        title: "Tỉnh / Thành phố",
        description:
          "Chọn một tỉnh/thành để xem danh sách phường/xã tương ứng.",
        emptyTitle: "Không có tỉnh/thành",
        emptyDescription:
          "Chưa có bản ghi tỉnh/thành hoặc kết quả tìm kiếm không khớp.",
      };

  const tableHeader = (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
          {toolbar?.title}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
        {hasSearch || toolbar?.actionLabel ? (
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
            onSubmit={handleSearchSubmit}
          >
            {hasSearch ? (
              <div className="relative min-w-0 sm:w-80">
                <Search className="text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  name="q"
                  type="search"
                  value={draftValue}
                  onChange={(event) =>
                    setDraftState({
                      source: externalSearchValue,
                      value: event.target.value,
                    })
                  }
                  placeholder={toolbar?.searchPlaceholder}
                  aria-label={toolbar?.searchPlaceholder}
                  className="pl-9"
                />
              </div>
            ) : null}

            {toolbar?.actionLabel && toolbar.actionHref ? (
              <Button asChild size="sm" variant="outline">
                <Link href={toolbar.actionHref} className="gap-1.5">
                  <Plus className="size-4" />
                  {toolbar.actionLabel}
                </Link>
              </Button>
            ) : toolbar?.actionLabel ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={toolbar.onActionClick}
                disabled={!toolbar.onActionClick}
              >
                <Plus className="size-4" />
                {toolbar.actionLabel}
              </Button>
            ) : null}
          </form>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {selectedProvince ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigateToProvince()}
            >
              <ArrowLeft className="size-4" />
              Quay lại tỉnh/thành
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {selectedProvince ? (
        <LocationDrilldownTable
          data={wards}
          columns={wardColumns}
          emptyTitle={levelMeta.emptyTitle}
          emptyDescription={levelMeta.emptyDescription}
          header={tableHeader}
        />
      ) : (
        <LocationDrilldownTable
          data={provinces}
          columns={provinceColumns}
          emptyTitle={levelMeta.emptyTitle}
          emptyDescription={levelMeta.emptyDescription}
          header={tableHeader}
          actionLabel="Xem phường/xã"
          onSelect={(province) => navigateToProvince(province.id)}
        />
      )}

      {!selectedProvince ? (
        <div className="surface-card border-hairline border p-4">
          <p className="text-secondary text-sm">
            Chọn một tỉnh/thành để chuyển sang level phường/xã.
          </p>
        </div>
      ) : null}
    </div>
  );
}
