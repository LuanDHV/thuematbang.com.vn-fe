"use client";

import { useMemo } from "react";
import AdminDataTable from "@/components/cms/admin/data-table";
import { type FieldConfig } from "@/components/cms/admin/column-generator";
import type { Province, Street, Ward } from "@/types/location";

type AdminLocationsTableProps = {
  provinces: Province[];
  wards: Ward[];
  streets: Street[];
  selectedProvince?: Province | null;
  searchValue?: string;
};

type LocationTableSectionProps<TData> = {
  title: string;
  data: TData[];
  fields: FieldConfig<TData>[];
  getRowId: (row: TData) => number;
};

function LocationTableSection<TData>({
  title,
  data,
  fields,
  getRowId,
}: LocationTableSectionProps<TData>) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-heading text-base font-semibold">{title}</h3>
      </div>

      <AdminDataTable
        data={data}
        fields={fields}
        getRowId={getRowId}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </section>
  );
}

export default function AdminLocationsTable({
  provinces,
  wards,
  streets,
  selectedProvince,
  searchValue,
}: AdminLocationsTableProps) {
  const provinceFields = useMemo<FieldConfig<Province>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        fieldType: "text",
        accessor: (province) => province.name,
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
          province.id === selectedProvince?.id ? "Đang chọn" : "Chọn",
        onDelete: (id) => {
          console.info("Delete province", id);
        },
      },
    ],
    [searchValue, selectedProvince?.id],
  );

  const wardFields = useMemo<FieldConfig<Ward>[]>(
    () => [
      {
        key: "name",
        header: "Tên",
        fieldType: "text",
        accessor: (ward) => ward.name,
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
      />

      {selectedProvince ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <LocationTableSection
            title="Phường / Xã"
            data={wards}
            fields={wardFields}
            getRowId={(ward) => ward.id}
          />

          <LocationTableSection
            title="Đường phố"
            data={streets}
            fields={streetFields}
            getRowId={(street) => street.id}
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
