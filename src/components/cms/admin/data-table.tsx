"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  Pagination,
  TablePaginationFooter,
} from "@/components/common/Pagination";
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
  FieldConfig,
  getFieldMobileSection,
  renderFieldContent,
  useOrderedMobileFields,
} from "./column-generator";

type RowId = string | number;

export type AdminDataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => RowId;
  rowHref?: (row: TData) => string;
  getRowClassName?: (row: TData) => string | undefined;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  loadingRowCount?: number;
  className?: string;
};

function LoadingRows({
  columnCount,
  rowCount,
}: {
  columnCount: number;
  rowCount: number;
}) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <TableRow key={`loading-row-${rowIndex}`}>
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <TableCell key={`loading-cell-${rowIndex}-${columnIndex}`}>
          <div className="bg-subtle h-4 w-full animate-pulse rounded-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function LoadingCards({ rowCount }: { rowCount: number }) {
  return Array.from({ length: rowCount }, (_, index) => (
    <article
      key={`loading-card-${index}`}
      className="surface-card space-y-4 p-4"
    >
      <div className="space-y-2">
        <div className="bg-subtle h-3 w-16 animate-pulse rounded-full" />
        <div className="bg-subtle h-5 w-2/3 animate-pulse rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="bg-subtle h-3 w-20 animate-pulse rounded-full" />
          <div className="bg-subtle h-4 w-full animate-pulse rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="bg-subtle h-3 w-20 animate-pulse rounded-full" />
          <div className="bg-subtle h-4 w-24 animate-pulse rounded-full" />
        </div>
      </div>
    </article>
  ));
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2 py-14 text-center">
      <p className="text-heading text-base font-semibold">{title}</p>
      <p className="text-secondary text-sm">{description}</p>
    </div>
  );
}

export default function AdminDataTable<TData>({
  data,
  columns,
  fields,
  getRowId,
  rowHref,
  getRowClassName,
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Chưa có bản ghi nào cho danh sách này.",
  loadingRowCount = 5,
  className,
}: AdminDataTableProps<TData>) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const mobileFields = useOrderedMobileFields(fields);
  const headerFields = mobileFields.filter(
    (field) => getFieldMobileSection(field) === "header",
  );
  const bodyFields = mobileFields.filter(
    (field) => getFieldMobileSection(field) === "body",
  );
  const footerFields = mobileFields.filter(
    (field) => getFieldMobileSection(field) === "footer",
  );
  const actionFields = footerFields.filter(
    (field) => field.fieldType === "actions",
  );
  const footerContentFields = footerFields.filter(
    (field) => field.fieldType !== "actions",
  );

  return (
    <div className={cn("surface-panel overflow-hidden", className)}>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows
                columnCount={columns.length}
                rowCount={loadingRowCount}
              />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={[
                    rowHref ? "cursor-pointer hover:bg-subtle/30" : "",
                    getRowClassName?.(row.original) ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={
                    rowHref
                      ? () => {
                          router.push(rowHref(row.original));
                        }
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-0">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
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
        {isLoading ? (
          <LoadingCards rowCount={loadingRowCount} />
        ) : data.length > 0 ? (
          data.map((row) => {
            const rowId = getRowId(row);

            return (
              <article
                key={String(rowId)}
                className={[
                  "surface-card space-y-4 p-4",
                  getRowClassName?.(row) ?? "",
                  rowHref ? "cursor-pointer" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={
                  rowHref
                    ? () => {
                        router.push(rowHref(row));
                      }
                    : undefined
                }
              >
                <div className="border-hairline space-y-3 border-b pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                        ID {rowId}
                      </p>
                      {headerFields.length > 0 ? (
                        <div className="space-y-2">
                          {headerFields.map((field) => {
                            const value = field.accessor
                              ? field.accessor(row)
                              : (row as Record<string, unknown>)[field.key];

                            return (
                              <div key={`${String(rowId)}-${field.key}`}>
                                {field.mobileLabel ? (
                                  <p className="text-secondary mb-1 text-xs font-medium">
                                    {field.mobileLabel}
                                  </p>
                                ) : null}
                                <div
                                  className={cn(
                                    "text-body text-sm",
                                    field.emphasizeOnMobile &&
                                      "text-heading text-base font-semibold",
                                  )}
                                >
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

                {bodyFields.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bodyFields.map((field) => {
                      const value = field.accessor
                        ? field.accessor(row)
                        : (row as Record<string, unknown>)[field.key];

                      return (
                        <div
                          key={`${String(rowId)}-${field.key}`}
                          className="space-y-1"
                        >
                          <p className="text-secondary text-xs font-medium">
                            {field.mobileLabel ?? field.header}
                          </p>
                          <div className="text-body text-sm">
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

                {footerContentFields.length > 0 ? (
                  <div className="border-hairline border-t pt-4">
                    <div className="grid gap-3">
                      {footerContentFields.map((field) => {
                        const value = field.accessor
                          ? field.accessor(row)
                          : (row as Record<string, unknown>)[field.key];

                        return (
                          <div
                            key={`${String(rowId)}-${field.key}`}
                            className="space-y-1"
                          >
                            <p className="text-secondary text-xs font-medium">
                              {field.mobileLabel ?? field.header}
                            </p>
                            <div className="text-body text-sm">
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
                  </div>
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="surface-card px-4">
            <EmptyState title={emptyTitle} description={emptyDescription} />
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
