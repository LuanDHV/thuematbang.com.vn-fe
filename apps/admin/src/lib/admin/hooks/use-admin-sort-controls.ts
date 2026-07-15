import { useEffect, useMemo, useState } from "react";
import type { CrudSort } from "@refinedev/core";

export type AdminSortOrder = "asc" | "desc";

export type AdminSortOption = {
  label: string;
  value: string;
};

type Options = {
  sorters: CrudSort[];
  setSorters: (sorters: CrudSort[]) => void;
  initialField?: string;
  initialOrder?: AdminSortOrder;
};

export function useAdminSortControls({
  sorters,
  setSorters,
  initialField,
  initialOrder = "desc",
}: Options) {
  const activeSorter = sorters[0];
  const [sortField, setSortField] = useState<string | undefined>(
    activeSorter?.field ?? initialField,
  );
  const [sortOrder, setSortOrder] = useState<AdminSortOrder>(
    (activeSorter?.order as AdminSortOrder | undefined) ?? initialOrder,
  );

  useEffect(() => {
    if (!activeSorter) {
      setSortField((current) => current ?? initialField);
      setSortOrder(initialOrder);
      return;
    }

    setSortField(activeSorter.field);
    setSortOrder((activeSorter.order as AdminSortOrder) ?? initialOrder);
  }, [activeSorter, initialField, initialOrder]);

  const hasSort = useMemo(() => Boolean(sortField), [sortField]);

  const applySort = () => {
    if (!sortField) {
      setSorters([]);
      return;
    }

    setSorters([
      {
        field: sortField,
        order: sortOrder,
      },
    ]);
  };

  const clearSort = () => {
    setSortField(initialField);
    setSortOrder(initialOrder);
    setSorters([]);
  };

  return {
    hasSort,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder,
    applySort,
    clearSort,
  };
}
