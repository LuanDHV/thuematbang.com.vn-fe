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
              "flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
              active
                ? "border-primary bg-primary text-white"
                : "hover:border-primary/40 hover:bg-primary/5 border-gray-200 bg-white text-gray-500",
            )}
          >
            {nextPage}
          </button>
        );
      })}
    </div>
  );
}
