import { cn } from "@/lib/utils";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

function getPageNumbers(page: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  if (page <= 3) {
    return [1, 2, 3, "...", total];
  }

  if (page >= total - 2) {
    return [1, "...", total - 2, total - 1, total];
  }

  return [1, "...", page, "...", total];
}

function PaginationControls({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-all",
          "text-secondary border-hairline bg-surface shadow-(--shadow-card)",
          "hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
          "disabled:hover:text-secondary disabled:hover:border-hairline disabled:hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        ←
      </button>

      {pages.map((p, i) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${i}`}
              className="text-secondary/40 flex h-10 min-w-10 items-center justify-center text-sm font-semibold tracking-widest"
            >
              …
            </span>
          );
        }

        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-all",
              active
                ? "border-primary bg-primary text-white shadow-(--shadow-card)"
                : "text-secondary hover:border-primary/20 hover:bg-primary/5 hover:text-primary border-hairline bg-surface shadow-(--shadow-card)",
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={cn(
          "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-all",
          "text-secondary border-hairline bg-surface shadow-(--shadow-card)",
          "hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
          "disabled:hover:text-secondary disabled:hover:border-hairline disabled:hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        →
      </button>
    </div>
  );
}

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

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onChange={onChange}
      />
    </div>
  );
}

export function TablePaginationFooter({
  page,
  totalPages,
  onChange,
  colSpan = 1,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  colSpan?: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={colSpan} className="bg-surface px-4 py-4 md:px-5">
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onChange={onChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
