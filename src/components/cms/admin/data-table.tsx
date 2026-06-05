/* eslint-disable react-hooks/incompatible-library */
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";

import {
  Pagination,
  TablePaginationFooter,
} from "@/components/common/Pagination";
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
import {
  createColumnsFromFields,
  renderFieldContent,
} from "./column-generator";
import type { FieldConfig } from "./column-generator";

type RowId = string | number;

export type AdminTableToolbar = {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
};

export type AdminDataTableProps<TData> = {
  data: TData[];
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => RowId;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  toolbar?: AdminTableToolbar;
};

const SEARCH_DEBOUNCE_MS = 350;

function EmptyState() {
  return (
    <div className="space-y-2 py-14 text-center">
      <p className="text-heading text-base font-semibold">Không có dữ liệu</p>
      <p className="text-secondary text-sm">
        Chưa có bản ghi nào cho danh sách này.
      </p>
    </div>
  );
}

export default function AdminDataTable<TData>({
  data,
  fields,
  getRowId,
  page,
  totalPages,
  onPageChange,
  toolbar,
}: AdminDataTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const externalSearchValue = toolbar?.searchValue ?? "";
  const [draftState, setDraftState] = useState({
    source: externalSearchValue,
    value: externalSearchValue,
  });
  const draftValue =
    draftState.source === externalSearchValue
      ? draftState.value
      : externalSearchValue;
  const columns = useMemo(
    () =>
      createColumnsFromFields<TData>({
        fields,
        getRowId,
      }),
    [fields, getRowId],
  );
  const actionFields = useMemo(
    () => fields.filter((field) => field.fieldType === "actions"),
    [fields],
  );
  const contentFields = useMemo(
    () => fields.filter((field) => field.fieldType !== "actions"),
    [fields],
  );
  const mobileContentFields = useMemo(
    () => contentFields.filter((field) => !field.mobileHidden),
    [contentFields],
  );

  const hasSearch = Boolean(toolbar?.searchPlaceholder);
  const hasDraftSearchChange = draftValue !== externalSearchValue;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasSearch) return;

    const href = buildSearchHref(draftValue);
    const currentHref = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (href !== currentHref) {
      router.replace(href);
    }
  };

  return (
    <div className="surface-panel overflow-hidden">
      <div className="border-hairline space-y-3 border-b px-3 py-3 md:px-4">
        {toolbar ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="text-heading text-sm font-semibold uppercase">
                {toolbar.title}
              </h2>
            </div>

            {hasSearch || toolbar.actionLabel ? (
              <form
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
                onSubmit={handleSubmit}
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
                      placeholder={toolbar.searchPlaceholder}
                      aria-label={toolbar.searchPlaceholder}
                      className="pl-9"
                    />
                  </div>
                ) : null}

                {toolbar.actionLabel && toolbar.actionHref ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={toolbar.actionHref} className="gap-1.5">
                      <Plus className="size-4" />
                      {toolbar.actionLabel}
                    </Link>
                  </Button>
                ) : toolbar.actionLabel ? (
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
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <Table className="min-w-full">
          <TableHeader className="[&_tr]:border-hairline">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "bg-surface text-secondary sticky top-0 z-10 font-semibold",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-subtle/70 cursor-default"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className={cn("align-middle")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {totalPages > 1 ? (
            <TablePaginationFooter
              page={page}
              totalPages={totalPages}
              onChange={onPageChange}
              colSpan={columns.length}
            />
          ) : null}
        </Table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {data.length > 0 ? (
          data.map((row) => {
            const rowId = getRowId(row);

            return (
              <article
                key={String(rowId)}
                className="surface-card space-y-4 p-4"
              >
                <div className="border-hairline space-y-3 border-b pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                        ID {rowId}
                      </p>
                    </div>

                    {actionFields.map((field) => (
                      <div key={`${String(rowId)}-${field.key}`}>
                        {renderFieldContent({
                          field,
                          row,
                          value: undefined,
                          rowId,
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {mobileContentFields.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {mobileContentFields.map((field) => {
                      const value = field.accessor
                        ? field.accessor(row)
                        : (row as Record<string, unknown>)[field.key];

                      return (
                        <div
                          key={`${String(rowId)}-${field.key}`}
                          className="min-w-0 space-y-1"
                        >
                          <p className="text-secondary text-xs font-medium">
                            {field.header}
                          </p>
                          <div className="text-body min-w-0 overflow-hidden text-sm">
                            {renderFieldContent({
                              field,
                              row,
                              value,
                              rowId,
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="surface-card px-4">
            <EmptyState />
          </div>
        )}

        {totalPages > 1 ? (
          <div className="pt-2">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={onPageChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
