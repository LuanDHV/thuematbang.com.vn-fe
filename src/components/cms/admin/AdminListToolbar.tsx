import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminListToolbarProps = {
  eyebrow: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  createLabel: string;
  searchValue?: string;
};

export default function AdminListToolbar({
  eyebrow,
  title,
  description,
  searchPlaceholder,
  createLabel,
  searchValue,
}: AdminListToolbarProps) {
  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b px-4 py-4 md:px-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
              {eyebrow}
            </p>
            <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
              {title}
            </h1>
            <p className="text-secondary text-sm leading-7 md:text-base">
              {description}
            </p>
          </div>

          <form className="flex justify-between gap-3">
            <div className="relative min-w-0 sm:w-80">
              <Search className="text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                name="q"
                type="search"
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Bộ lọc"
              >
                <Filter className="size-4" />
              </Button>
              <Button type="button" size="sm" className="gap-1.5">
                <Plus className="size-4" />
                {createLabel}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
