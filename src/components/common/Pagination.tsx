import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      {pages.map((nextPage) => {
        const active = nextPage === page;

        return (
          <button
            key={nextPage}
            type="button"
            onClick={() => onChange(nextPage)}
            className={cn(
              "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-all",
              active
                ? "border-primary bg-primary text-white shadow-[0_14px_30px_rgba(251,170,25,0.18)]"
                : "border-black/8 bg-white text-muted shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
            )}
          >
            {nextPage}
          </button>
        );
      })}
    </div>
  );
}
