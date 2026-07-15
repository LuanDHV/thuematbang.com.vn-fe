"use client";

type CategoryChipItem = {
  id: string | number;
  label: string;
  value: string;
};

type CategoryChipsProps = {
  items: CategoryChipItem[];
  activeValue?: string | null;
  onChange: (value: string) => void;
  className?: string;
};

export function CategoryChips({
  items,
  activeValue,
  onChange,
  className,
}: CategoryChipsProps) {
  return (
    <div
      className={`-mx-1 overflow-x-auto px-1 pb-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      <div className="flex w-max min-w-full gap-2 whitespace-nowrap">
        {items.map((item) => {
          const isActive = activeValue === item.value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.value)}
              className={`focus-visible:ring-primary/35 relative inline-flex cursor-pointer snap-start items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium tracking-[-0.01em] transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none ${
                isActive
                  ? "border-primary/10 bg-primary hover:bg-primary/95 text-white"
                  : "bg-surface/80 text-body hover:border-primary/35 hover:text-primary border-border-subtle border"
              } `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { CategoryChipItem };
