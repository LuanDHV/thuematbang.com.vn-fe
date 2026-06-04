"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Province, Street, Ward } from "@/types/location";

type AdminLocationsTableProps = {
  provinces: Province[];
  wards: Ward[];
  streets: Street[];
  selectedProvince?: Province | null;
  selectedWard?: Ward | null;
  searchValue?: string;
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
  onSelect?: (row: TData) => void;
  actionLabel?: string;
};

function LocationDrilldownTable<TData extends { id: number }>({
  data,
  columns,
  emptyTitle,
  emptyDescription,
  onSelect,
  actionLabel,
}: LocationDrilldownTableProps<TData>) {
  return (
    <div className="surface-panel overflow-hidden">
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
                    <p className="text-secondary text-sm">
                      {emptyDescription}
                    </p>
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
  streets,
  selectedProvince,
  selectedWard,
  searchValue,
}: AdminLocationsTableProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query params drive the visible level so reload and browser history stay
  // aligned with the server-fetched province -> ward -> street hierarchy.
  const navigateWithParams = (
    provinceId?: QueryValue,
    wardId?: QueryValue,
  ) => {
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

    if (wardId) {
      params.set("wardId", String(wardId));
    } else {
      params.delete("wardId");
    }

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
            <p className="text-secondary text-xs">Nhấn để xem đường phố</p>
          </div>
        ),
      },
      {
        key: "slug",
        header: "Slug",
        render: (ward) => ward.slug,
      },
    ],
    [],
  );

  const streetColumns = useMemo<DrilldownColumn<Street>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        render: (street) => street.name,
      },
      {
        key: "slug",
        header: "Slug",
        render: (street) => street.slug,
      },
      {
        key: "wardId",
        header: "Phường ID",
        className: "hidden lg:table-cell",
        render: (street) => street.wardId ?? "Chưa có",
      },
    ],
    [],
  );

  const levelMeta = selectedWard
    ? {
        eyebrow: "Level 3",
        title: "Đường phố",
        description: `Danh sách đường phố thuộc ${selectedWard.name}.`,
        emptyTitle: "Chưa có dữ liệu đường phố",
        emptyDescription:
          "Hiện chưa có bản ghi đường phố cho phường/xã này hoặc kết quả tìm kiếm không khớp.",
      }
    : selectedProvince
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
              "Chọn một tỉnh/thành để drill down sang danh sách phường/xã tương ứng.",
            emptyTitle: "Không có tỉnh/thành",
            emptyDescription:
              "Chưa có bản ghi tỉnh/thành hoặc kết quả tìm kiếm không khớp.",
          };

  const pathLabels = [selectedProvince?.name, selectedWard?.name].filter(
    Boolean,
  );

  return (
    <div className="space-y-5">
      <section className="surface-panel overflow-hidden">
        <div className="border-hairline flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
              {levelMeta.eyebrow}
            </p>
            <h2 className="text-heading text-lg font-semibold tracking-[-0.02em] md:text-xl">
              {levelMeta.title}
            </h2>
            <p className="text-secondary text-sm leading-7">
              {levelMeta.description}
            </p>
            {pathLabels.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {pathLabels.map((label) => (
                  <span
                    key={label}
                    className="bg-subtle text-secondary rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedWard ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigateWithParams(selectedProvince?.id)}
              >
                <ArrowLeft className="size-4" />
                Quay lại phường/xã
              </Button>
            ) : null}
            {selectedProvince ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigateWithParams()}
              >
                <ArrowLeft className="size-4" />
                Quay lại tỉnh/thành
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {selectedWard ? (
        <LocationDrilldownTable
          data={streets}
          columns={streetColumns}
          emptyTitle={levelMeta.emptyTitle}
          emptyDescription={levelMeta.emptyDescription}
        />
      ) : selectedProvince ? (
        <LocationDrilldownTable
          data={wards}
          columns={wardColumns}
          emptyTitle={levelMeta.emptyTitle}
          emptyDescription={levelMeta.emptyDescription}
          actionLabel="Xem đường phố"
          onSelect={(ward) => navigateWithParams(selectedProvince.id, ward.id)}
        />
      ) : (
        <LocationDrilldownTable
          data={provinces}
          columns={provinceColumns}
          emptyTitle={levelMeta.emptyTitle}
          emptyDescription={levelMeta.emptyDescription}
          actionLabel="Xem phường/xã"
          onSelect={(province) => navigateWithParams(province.id)}
        />
      )}

      {!selectedProvince ? (
        <div className="surface-card border-hairline border p-4">
          <p className="text-secondary text-sm">
            Chọn một tỉnh/thành để chuyển sang level phường/xã. Từ đó có thể
            drill down tiếp sang đường phố khi dữ liệu streets sẵn sàng.
          </p>
        </div>
      ) : null}
    </div>
  );
}
