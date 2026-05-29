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
              className={`focus-visible:ring-primary/35 relative inline-flex cursor-pointer snap-start items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none ${
                isActive
                  ? "bg-primary text-white"
                  : "text-body hover:border-primary hover:text-heading border-[rgba(61,32,10,0.14)] bg-white"
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
