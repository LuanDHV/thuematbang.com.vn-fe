import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminListToolbarProps = {
  eyebrow: string;
  searchPlaceholder: string;
  createLabel: string;
  searchValue?: string;
  hiddenParams?: Array<{
    name: string;
    value: string;
  }>;
};

export default function AdminListToolbar({
  eyebrow,
  searchPlaceholder,
  createLabel,
  searchValue,
  hiddenParams,
}: AdminListToolbarProps) {
  return (
    <section className="surface-panel overflow-hidden">
      <div className="border-hairline border-b p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              {eyebrow}
            </p>
          </div>

          <form className="flex justify-between gap-3">
            {hiddenParams?.map((field) => (
              <input
                key={`${field.name}-${field.value}`}
                type="hidden"
                name={field.name}
                value={field.value}
              />
            ))}

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
