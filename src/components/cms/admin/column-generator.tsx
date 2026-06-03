"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

type RowId = string | number;
type MobileSection = "header" | "body" | "footer";
type BadgeVariant = NonNullable<BadgeProps["variant"]>;

type BaseFieldConfig<TData> = {
  key: string;
  header: string;
  fieldType: "text" | "number" | "image" | "badge" | "date" | "actions";
  accessor?: (row: TData) => unknown;
  format?: (value: unknown, row: TData) => ReactNode;
  fallback?: ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  mobileLabel?: string;
  mobileOrder?: number;
  hideOnMobile?: boolean;
  emphasizeOnMobile?: boolean;
  mobileSection?: MobileSection;
};

type NumberFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "number";
  numberFormatOptions?: Intl.NumberFormatOptions;
};

type ImageFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "image";
  altAccessor?: (row: TData) => string;
  width?: number;
  height?: number;
  roundedClassName?: string;
};

type BadgeFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "badge";
  badgeMap?: Record<
    string,
    {
      label?: ReactNode;
      variant?: BadgeVariant;
    }
  >;
  resolveBadgeVariant?: (value: unknown, row: TData) => BadgeVariant;
  resolveBadgeLabel?: (value: unknown, row: TData) => ReactNode;
};

type DateFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "date";
  formatOptions?: Intl.DateTimeFormatOptions;
};

type ActionsFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "actions";
  getEditHref: (row: TData) => string;
  onDelete?: (id: RowId, row: TData) => Promise<void> | void;
  editLabel?: string;
  deleteLabel?: string;
  deleteTitle?: string;
  deleteDescription?: string;
};

type TextFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "text";
};

export type FieldConfig<TData> =
  | TextFieldConfig<TData>
  | NumberFieldConfig<TData>
  | ImageFieldConfig<TData>
  | BadgeFieldConfig<TData>
  | DateFieldConfig<TData>
  | ActionsFieldConfig<TData>;

export type FieldRenderContext<TData> = {
  field: FieldConfig<TData>;
  row: TData;
  value: unknown;
  rowId: RowId;
};

type CreateColumnsOptions<TData> = {
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => RowId;
};

function getFieldValue<TData>(row: TData, field: FieldConfig<TData>) {
  if (field.accessor) {
    return field.accessor(row);
  }

  return (row as Record<string, unknown>)[field.key];
}

function getFallbackContent<TData>(field: FieldConfig<TData>) {
  return field.fallback ?? "—";
}

function isValueEmpty(value: unknown) {
  return value === null || value === undefined || value === "";
}

function formatNumberValue<TData>(
  value: unknown,
  field: NumberFieldConfig<TData>,
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  return new Intl.NumberFormat("vi-VN", field.numberFormatOptions).format(
    value,
  );
}

function formatDateValue<TData>(value: unknown, field: DateFieldConfig<TData>) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...field.formatOptions,
  }).format(date);
}

function resolveBadgeContent<TData>(
  field: BadgeFieldConfig<TData>,
  value: unknown,
  row: TData,
) {
  const badgeKey = String(value ?? "").toLowerCase();
  const mapped = field.badgeMap?.[badgeKey];
  const variant = field.resolveBadgeVariant?.(value, row) ?? mapped?.variant ?? "outline";
  const label =
    field.resolveBadgeLabel?.(value, row) ??
    mapped?.label ??
    (typeof value === "string" || typeof value === "number"
      ? String(value)
      : getFallbackContent(field));

  return { label, variant };
}

function RowActionsMenu<TData>({
  field,
  row,
  rowId,
}: {
  field: ActionsFieldConfig<TData>;
  row: TData;
  rowId: RowId;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!field.onDelete) return;
    setIsDeleting(true);

    try {
      await field.onDelete(rowId, row);
      setOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Tác vụ cho bản ghi ${rowId}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={field.getEditHref(row)}>
              <Pencil className="size-4" />
              {field.editLabel ?? "Chỉnh sửa"}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-700 focus:text-red-700"
            onSelect={(event) => {
              event.preventDefault();
              setOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            {field.deleteLabel ?? "Xóa"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {field.deleteTitle ?? "Bạn có chắc chắn muốn xóa không?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {field.deleteDescription ??
              `Bản ghi ID ${rowId} sẽ bị xóa khỏi danh sách này.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function renderFieldContent<TData>({
  field,
  row,
  value,
  rowId,
}: FieldRenderContext<TData>) {
  if (field.fieldType === "actions") {
    return <RowActionsMenu field={field} row={row} rowId={rowId} />;
  }

  if (field.format) {
    return field.format(value, row);
  }

  if (isValueEmpty(value)) {
    return getFallbackContent(field);
  }

  switch (field.fieldType) {
    case "number": {
      const formatted = formatNumberValue(value, field);
      return formatted ?? getFallbackContent(field);
    }
    case "image": {
      if (typeof value !== "string" || value.length === 0) {
        return getFallbackContent(field);
      }

      const alt = field.altAccessor?.(row) ?? field.header;

      return (
        <div className="bg-subtle inline-flex overflow-hidden rounded-xl border border-black/6 p-1">
          <Image
            src={value}
            alt={alt}
            width={field.width ?? 56}
            height={field.height ?? 56}
            className={cn(
              "h-14 w-14 rounded-lg object-cover",
              field.roundedClassName,
            )}
            unoptimized
          />
        </div>
      );
    }
    case "badge": {
      const badge = resolveBadgeContent(field, value, row);
      return <Badge variant={badge.variant}>{badge.label}</Badge>;
    }
    case "date": {
      const formatted = formatDateValue(value, field);
      return formatted ?? getFallbackContent(field);
    }
    case "text":
    default:
      return value as ReactNode;
  }
}

export function createColumnsFromFields<TData>({
  fields,
  getRowId,
}: CreateColumnsOptions<TData>): ColumnDef<TData, unknown>[] {
  const idColumn: ColumnDef<TData, unknown> = {
    id: "system-id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-secondary text-xs font-medium">
        {String(getRowId(row.original))}
      </span>
    ),
    meta: {
      headerClassName: "w-[90px]",
      cellClassName: "align-top",
    },
  };

  const generatedColumns = fields.map<ColumnDef<TData, unknown>>((field) => ({
    id: field.key,
    header: field.header,
    cell: ({ row }) => {
      const rowId = getRowId(row.original);
      const value = getFieldValue(row.original, field);

      return (
        <div className={cn(field.className)}>
          {renderFieldContent({
            field,
            row: row.original,
            value,
            rowId,
          })}
        </div>
      );
    },
    meta: {
      headerClassName: field.headerClassName,
      cellClassName: cn("align-top", field.cellClassName),
    },
  }));

  return [idColumn, ...generatedColumns];
}

export function useOrderedMobileFields<TData>(fields: FieldConfig<TData>[]) {
  return useMemo(
    () =>
      fields
        .filter((field) => !field.hideOnMobile)
        .sort((left, right) => {
          const leftOrder = left.mobileOrder ?? Number.MAX_SAFE_INTEGER;
          const rightOrder = right.mobileOrder ?? Number.MAX_SAFE_INTEGER;
          return leftOrder - rightOrder;
        }),
    [fields],
  );
}

export function getFieldMobileSection<TData>(field: FieldConfig<TData>) {
  if (field.mobileSection) {
    return field.mobileSection;
  }

  if (field.fieldType === "actions") {
    return "footer";
  }

  return field.emphasizeOnMobile ? "header" : "body";
}

export function getMobileFieldValue<TData>(
  row: TData,
  field: FieldConfig<TData>,
) {
  return getFieldValue(row, field);
}
