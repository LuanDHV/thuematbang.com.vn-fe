"use client";

type EligibleListing = {
  id: number;
  title: string;
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
  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="surface-panel border-hairline rounded-xl border p-4">
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
        <div className="border-hairline bg-surface max-h-56 overflow-y-auto rounded-xl border">
          <div className="divide-hairline divide-y">
            {eligibleListings.map((item) => {
              const checked = selectedIds.includes(item.id);

              return (
                <label
                  key={item.id}
                  className="hover:bg-surface-alt/70 flex cursor-pointer items-center gap-3 px-3 py-3 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleId(item.id)}
                    className="border-hairline text-primary mt-0.5 h-4 w-4 shrink-0 rounded border"
                  />

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {checked ? (
                        <span className="bg-accent-soft text-primary rounded-full px-2 py-0.5 text-[11px] font-semibold">
                          Đã chọn
                        </span>
                      ) : null}
                    </div>
                    <p className="text-body text-sm leading-5 wrap-break-word">
                      #{item.id} - {item.title}
                    </p>
                  </div>
                </label>
              );
            })}
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
