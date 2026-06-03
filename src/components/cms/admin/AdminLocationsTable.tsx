"use client";

import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import {
  createColumnsFromFields,
  type FieldConfig,
} from "@/components/cms/admin/column-generator";
import type { Province, Street, Ward } from "@/types/location";

type AdminLocationsTableProps = {
  provinces: Province[];
  wards: Ward[];
  streets: Street[];
  selectedProvince?: Province | null;
  selectedProvinceId?: number | null;
  searchValue?: string;
};

type LocationTableSectionProps<TData> = {
  title: string;
  data: TData[];
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => number;
  emptyDescription: string;
  rowHref?: (row: TData) => string;
  getRowClassName?: (row: TData) => string | undefined;
};

function LocationTableSection<TData>({
  title,
  data,
  fields,
  getRowId,
  emptyDescription,
  rowHref,
  getRowClassName,
}: LocationTableSectionProps<TData>) {
  const columns = useMemo(
    () =>
      createColumnsFromFields<TData>({
        fields,
        getRowId,
      }),
    [fields, getRowId],
  );

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-heading text-base font-semibold">{title}</h3>
      </div>

      <AdminDataTable
        data={data}
        columns={columns}
        fields={fields}
        getRowId={getRowId}
        rowHref={rowHref}
        getRowClassName={getRowClassName}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        emptyDescription={emptyDescription}
      />
    </section>
  );
}

export default function AdminLocationsTable({
  provinces,
  wards,
  streets,
  selectedProvince,
  selectedProvinceId,
  searchValue,
}: AdminLocationsTableProps) {
  const provinceFields = useMemo<FieldConfig<Province>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        fieldType: "text",
        accessor: (province) => province.name,
        emphasizeOnMobile: true,
        mobileSection: "header",
      },
      {
        key: "slug",
        header: "Slug",
        fieldType: "text",
        accessor: (province) => province.slug,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (province) => {
          const query = searchValue
            ? `&q=${encodeURIComponent(searchValue)}`
            : "";
          return `?provinceId=${province.id}${query}`;
        },
        getEditLabel: (province) =>
          province.id === selectedProvinceId ? "Đang chọn" : "Chọn",
        onDelete: (id) => {
          console.info("Delete province", id);
        },
      },
    ],
    [searchValue, selectedProvinceId],
  );

  const wardFields = useMemo<FieldConfig<Ward>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        fieldType: "text",
        accessor: (ward) => ward.name,
        emphasizeOnMobile: true,
        mobileSection: "header",
      },
      {
        key: "provinceId",
        header: "Tỉnh ID",
        fieldType: "number",
        accessor: (ward) => ward.provinceId,
      },
      {
        key: "slug",
        header: "Slug",
        fieldType: "text",
        accessor: (ward) => ward.slug,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (ward) => `/admin/locations/${ward.id}`,
        onDelete: (id) => {
          console.info("Delete ward", id);
        },
      },
    ],
    [],
  );

  const streetFields = useMemo<FieldConfig<Street>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        fieldType: "text",
        accessor: (street) => street.name,
        emphasizeOnMobile: true,
        mobileSection: "header",
      },
      {
        key: "provinceId",
        header: "Tỉnh ID",
        fieldType: "number",
        accessor: (street) => street.provinceId,
      },
      {
        key: "wardId",
        header: "Phường ID",
        fieldType: "text",
        accessor: (street) => street.wardId ?? "Chưa có",
      },
      {
        key: "slug",
        header: "Slug",
        fieldType: "text",
        accessor: (street) => street.slug,
      },
      {
        key: "actions",
        header: "Tác vụ",
        fieldType: "actions",
        getEditHref: (street) => `/admin/locations/${street.id}`,
        onDelete: (id) => {
          console.info("Delete street", id);
        },
      },
    ],
    [],
  );

  return (
    <div className="grid gap-5">
      <LocationTableSection
        title="Tỉnh / Thành phố"
        data={provinces}
        fields={provinceFields}
        getRowId={(province) => province.id}
        emptyDescription="Không có dữ liệu tỉnh/thành."
        rowHref={(province) => {
          const query = searchValue
            ? `&q=${encodeURIComponent(searchValue)}`
            : "";
          return `?provinceId=${province.id}${query}`;
        }}
        getRowClassName={(province) =>
          province.id === selectedProvinceId
            ? "bg-primary/5 ring-1 ring-primary/15"
            : ""
        }
      />

      {selectedProvince ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <LocationTableSection
            title="Phường / Xã"
            data={wards}
            fields={wardFields}
            getRowId={(ward) => ward.id}
            emptyDescription="Không có dữ liệu phường/xã."
          />

          <LocationTableSection
            title="Đường phố"
            data={streets}
            fields={streetFields}
            getRowId={(street) => street.id}
            emptyDescription="Không có dữ liệu đường phố."
          />
        </div>
      ) : (
        <div className="surface-card border-hairline border p-4">
          <p className="text-secondary text-sm">
            Chọn một tỉnh/thành ở bảng trên để hiển thị phường/xã và đường phố.
          </p>
        </div>
      )}
    </div>
  );
}
