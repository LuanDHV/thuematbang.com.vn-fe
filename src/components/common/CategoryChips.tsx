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
      className={`-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
    >
      <div className="flex w-max min-w-full snap-x snap-mandatory gap-3 whitespace-nowrap">
        {items.map((item) => {
          const isActive = activeValue === item.value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.value)}
              className={`snap-start cursor-pointer rounded-xl border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-primary border-primary text-white"
                  : "border-primary text-primary hover:bg-primary/10 bg-white"
              }`}
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
