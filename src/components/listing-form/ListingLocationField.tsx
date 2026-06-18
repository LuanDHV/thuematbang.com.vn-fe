"use client";

import { useEffect, useMemo } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { getProvinceWardsAction } from "@/actions/location.actions";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { Province } from "@/types/location";

type ListingLocationFieldProps = {
  provinceName: string;
  wardName: string;
  provinces: Province[];
  labelProvince?: string;
  labelWard?: string;
  description?: string;
  requiredProvince?: boolean;
};

export function ListingLocationField({
  provinceName,
  wardName,
  provinces,
  labelProvince = "Khu vực",
  labelWard = "Phường/xã",
  description,
  requiredProvince = false,
}: ListingLocationFieldProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const selectedProvinceId = useWatch({ control, name: provinceName });
  const selectedWardId = useWatch({ control, name: wardName });

  const provinceError = errors[provinceName];
  const wardError = errors[wardName];
  const provinceIdNumber = Number(selectedProvinceId || 0);

  const { data: wards = [], isFetching } = useQuery({
    queryKey: ["wards", provinceIdNumber],
    queryFn: async () => {
      if (!provinceIdNumber) return [];
      return await getProvinceWardsAction(provinceIdNumber);
    },
    enabled: Boolean(provinceIdNumber),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!selectedProvinceId) {
      if (selectedWardId) {
        setValue(wardName, "");
      }
      return;
    }

    const wardExists = wards.some(
      (ward) => String(ward.id) === String(selectedWardId),
    );

    if (!wardExists && selectedWardId) {
      setValue(wardName, "");
    }
  }, [selectedProvinceId, selectedWardId, setValue, wardName, wards]);

  const provinceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        value: String(province.id),
        label: province.name,
      })),
    [provinces],
  );

  const wardOptions = useMemo(
    () =>
      wards.map((ward) => ({
        value: String(ward.id),
        label: ward.name,
      })),
    [wards],
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field className="flex flex-col gap-2">
        <FieldLabel
          htmlFor={provinceName}
          className="text-heading font-semibold"
        >
          <span>{labelProvince}</span>
          {requiredProvince ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </FieldLabel>
        <Controller
          control={control}
          name={provinceName}
          render={({ field }) => (
            <SearchableSelect
              id={provinceName}
              value={field.value ? String(field.value) : ""}
              onValueChange={field.onChange}
              options={provinceOptions}
              placeholder="Chọn tỉnh/thành"
              searchPlaceholder="Tìm tỉnh/thành..."
            />
          )}
        />
        <FieldError>{provinceError?.message as string | undefined}</FieldError>
      </Field>

      <Field className="flex flex-col gap-2">
        <FieldLabel htmlFor={wardName} className="text-heading font-semibold">
          <span>{labelWard}</span>
        </FieldLabel>
        <Controller
          control={control}
          name={wardName}
          render={({ field }) => (
            <SearchableSelect
              id={wardName}
              value={field.value ? String(field.value) : ""}
              onValueChange={field.onChange}
              options={wardOptions}
              placeholder={
                provinceIdNumber
                  ? isFetching
                    ? "Đang tải phường/xã..."
                    : "Chọn phường/xã"
                  : "Chọn tỉnh/thành trước"
              }
              searchPlaceholder="Tìm phường/xã..."
              allowClear
              emptyLabel="Không chọn phường/xã"
              disabled={!provinceIdNumber || isFetching}
            />
          )}
        />
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        <FieldError>{wardError?.message as string | undefined}</FieldError>
      </Field>
    </div>
  );
}
