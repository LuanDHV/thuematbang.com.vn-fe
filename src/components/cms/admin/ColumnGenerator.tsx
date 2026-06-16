"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTableDate, formatTableNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type RowId = string | number;

type BaseFieldConfig<TData> = {
  key: string;
  header: string;
  fieldType: "text" | "number" | "image" | "date" | "actions";
  accessor?: (row: TData) => unknown;
  fallback?: ReactNode;
  render?: (context: FieldRenderContext<TData>) => ReactNode;
  mobileHidden?: boolean;
};

type NumberFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "number";
};

type ImageFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "image";
  altAccessor?: (row: TData) => string;
  width?: number;
  height?: number;
  roundedClassName?: string;
};

type DateFieldConfig<TData> = BaseFieldConfig<TData> & { fieldType: "date" };

type ActionsFieldConfig<TData> = BaseFieldConfig<TData> & {
  fieldType: "actions";
  getEditHref?: (row: TData) => string;
  onEdit?: (id: RowId, row: TData) => Promise<void> | void;
  onDelete?: (id: RowId, row: TData) => Promise<void> | void;
  editLabel?: string;
  getEditLabel?: (row: TData) => string;
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
    <div onClick={(event) => event.stopPropagation()}>
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
            {field.onEdit ? (
              <DropdownMenuItem
                onSelect={async (event) => {
                  event.preventDefault();
                  await field.onEdit?.(rowId, row);
                }}
              >
                <Pencil className="size-4" />
                {field.getEditLabel?.(row) ?? field.editLabel ?? "Chỉnh sửa"}
              </DropdownMenuItem>
            ) : field.getEditHref ? (
              <DropdownMenuItem asChild>
                <Link href={field.getEditHref(row)}>
                  <Pencil className="size-4" />
                  {field.getEditLabel?.(row) ?? field.editLabel ?? "Chỉnh sửa"}
                </Link>
              </DropdownMenuItem>
            ) : null}
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
    </div>
  );
}

export function renderFieldContent<TData>({
  field,
  row,
  value,
  rowId,
}: FieldRenderContext<TData>): ReactNode {
  if (field.render) {
    return field.render({
      field,
      row,
      value,
      rowId,
    });
  }

  if (field.fieldType === "actions") {
    return <RowActionsMenu field={field} row={row} rowId={rowId} />;
  }

  if (isValueEmpty(value)) {
    return getFallbackContent(field);
  }

  switch (field.fieldType) {
    case "number": {
      const formatted = formatTableNumber(value as number | null | undefined);
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
    case "date": {
      const formatted = formatTableDate(
        value as Date | string | null | undefined,
      );
      return formatted ?? getFallbackContent(field);
    }
    case "text":
    default:
      return typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
        ? String(value)
        : getFallbackContent(field);
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
  };

  const generatedColumns = fields.map<ColumnDef<TData, unknown>>((field) => ({
    id: field.key,
    header: field.header,
    cell: ({ row }) => {
      const rowId = getRowId(row.original);
      const value = getFieldValue(row.original, field);

      return renderFieldContent({
        field,
        row: row.original,
        value,
        rowId,
      });
    },
  }));

  return [idColumn, ...generatedColumns];
}
