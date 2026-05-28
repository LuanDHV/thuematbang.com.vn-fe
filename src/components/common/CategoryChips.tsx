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
      className={`-mx-1 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      <div className="flex w-max min-w-full snap-x snap-mandatory gap-2.5 whitespace-nowrap">
        {items.map((item) => {
          const isActive = activeValue === item.value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.value)}
              className={`focus-visible:ring-primary/35 relative cursor-pointer snap-start rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none ${
                isActive
                  ? "border-primary/35 text-heading bg-white shadow-[0_10px_24px_rgba(36,26,10,0.08)]"
                  : "text-body hover:border-primary/30 hover:text-heading border-black/10 bg-white/82 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_22px_rgba(36,26,10,0.08)]"
              }`}
            >
              {isActive ? (
                <span className="bg-primary absolute inset-x-3 -bottom-px h-0.5 rounded-full" />
              ) : null}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { CategoryChipItem };
