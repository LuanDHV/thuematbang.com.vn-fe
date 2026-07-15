"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type EligibleListing = {
  id: number;
  title: string;
  displayCode?: string | null;
};

type PosterContactCardEligibleListingsProps = {
  isAuthenticated: boolean;
  sourceIsProperty: boolean;
  loadingListings: boolean;
  eligibleListings: EligibleListing[];
  selectedIds: number[];
  onToggleId: (id: number) => void;
};

export default function PosterContactCardEligibleListings({
  isAuthenticated,
  sourceIsProperty,
  loadingListings,
  eligibleListings,
  selectedIds,
  onToggleId,
}: PosterContactCardEligibleListingsProps) {
  const [searchValue, setSearchValue] = useState("");
  const normalizedSearch = searchValue.trim().toLowerCase();
  const filteredListings = useMemo(() => {
    if (!normalizedSearch) {
      return eligibleListings;
    }

    return eligibleListings.filter((item) => {
      const displayCode = item.displayCode ?? "";
      return (
        displayCode.toLowerCase().includes(normalizedSearch) ||
        item.title.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [eligibleListings, normalizedSearch]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="surface-panel border-hairline rounded-2xl border p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-heading text-sm font-semibold">
            {sourceIsProperty
              ? "Chọn tin cần thuê của bạn nếu cảm thấy phù hợp"
              : "Chọn tin cho thuê của bạn nếu cảm thấy phù hợp"}
          </p>
        </div>
        <div className="bg-accent-soft text-primary shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
          {selectedIds.length} đã chọn
        </div>
      </div>

      {loadingListings ? (
        <p className="text-secondary text-xs">Đang tải...</p>
      ) : eligibleListings.length > 0 ? (
        <div className="space-y-3">
          {eligibleListings.length > 5 ? (
            <div className="relative">
              <Search className="text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm theo mã tin hoặc tiêu đề"
                className="h-10 pl-9 text-sm"
              />
            </div>
          ) : null}

          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {filteredListings.map((item) => {
              const checked = selectedIds.includes(item.id);
              const displayCode = item.displayCode?.trim() || `ID-${item.id}`;

              return (
                <label
                  key={item.id}
                  className={cn(
                    "border-hairline bg-surface hover:border-primary/30 hover:bg-surface-alt/70 flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors",
                    checked && "border-primary/40 bg-accent-soft/50",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleId(item.id)}
                    className="border-hairline text-primary mt-1 h-4 w-4 shrink-0 rounded border"
                  />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-secondary shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em]">
                        Mã tin
                      </span>
                      <span
                        title={displayCode}
                        className="bg-subtle text-heading border-hairline min-w-0 truncate rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold"
                      >
                        {displayCode}
                      </span>
                      {checked ? (
                        <span className="bg-primary text-primary-foreground ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                          Đã chọn
                        </span>
                      ) : null}
                    </div>
                    <p className="text-body line-clamp-2 text-sm leading-5">
                      {item.title}
                    </p>
                  </div>
                </label>
              );
            })}
            {filteredListings.length === 0 ? (
              <p className="text-secondary border-hairline rounded-xl border border-dashed px-3 py-4 text-center text-xs leading-5">
                Không tìm thấy tin phù hợp với từ khóa này.
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-secondary text-xs leading-5">
          Bạn chưa có tin {sourceIsProperty ? "cần thuê" : "cho thuê"} phù hợp
          để chọn.
        </p>
      )}
    </section>
  );
}
