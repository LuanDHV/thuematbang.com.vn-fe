import type { CrudFilters } from "@refinedev/core";
import type { FormInstance } from "antd";

type SearchValue = string | number | boolean | null | undefined;

export function buildAdminSearchFilters(
  values: Record<string, unknown>,
  fields: string[]
): CrudFilters {
  return fields.reduce<CrudFilters>((filters, field) => {
    const value = values[field] as SearchValue;

    if (value == null || value === "") {
      return filters;
    }

    filters.push({
      field,
      operator: "eq",
      value,
    });

    return filters;
  }, []);
}

export function submitAdminSearch(
  form?: FormInstance,
  setCurrentPage?: (page: number) => void
) {
  setCurrentPage?.(1);
  form?.submit();
}

export function resetAdminSearch(
  form?: FormInstance,
  setCurrentPage?: (page: number) => void,
  setFilters?: any
) {
  setCurrentPage?.(1);
  setFilters?.([], "replace");
  form?.resetFields();
  window.setTimeout(() => {
    form?.submit();
  }, 0);
}
