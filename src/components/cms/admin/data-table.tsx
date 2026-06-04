/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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
import {
  createColumnsFromFields,
  renderFieldContent,
} from "./column-generator";
import type { FieldConfig } from "./column-generator";

type RowId = string | number;

export type AdminDataTableProps<TData> = {
  data: TData[];
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => RowId;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

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
}: AdminDataTableProps<TData>) {
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="surface-panel overflow-hidden">
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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

                {contentFields.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {contentFields.map((field) => {
                      const value = field.accessor
                        ? field.accessor(row)
                        : (row as Record<string, unknown>)[field.key];

                      return (
                        <div
                          key={`${String(rowId)}-${field.key}`}
                          className="space-y-1"
                        >
                          <p className="text-secondary text-xs font-medium">
                            {field.header}
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
