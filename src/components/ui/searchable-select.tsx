"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { normalizeVietnameseText } from "@/lib/text/text-normalize";

export type SearchableSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SearchableSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly SearchableSelectOption[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  noResultsLabel?: string;
  portalContainer?: HTMLElement | null;
};

export function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  searchPlaceholder = "Tìm nhanh...",
  emptyLabel = "Không chọn",
  allowClear = false,
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  noResultsLabel = "Không tìm thấy kết quả phù hợp.",
  portalContainer,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const [resolvedPortalContainer, setResolvedPortalContainer] =
    React.useState<HTMLElement | null>(portalContainer ?? null);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filteredOptions = React.useMemo(() => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      return options;
    }

    const normalizedSearch = normalizeVietnameseText(trimmedSearch);
    return options.filter((option) => {
      const normalizedLabel = normalizeVietnameseText(option.label);
      return (
        normalizedLabel.includes(normalizedSearch) ||
        normalizeVietnameseText(option.value).includes(normalizedSearch)
      );
    });
  }, [options, search]);

  React.useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open]);

  const commitValue = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={rootRef} className="contents">
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setResolvedPortalContainer(
            nextOpen
              ? portalContainer ??
                  (rootRef.current?.closest(
                    '[data-slot="dialog-content"]',
                  ) as HTMLElement | null)
              : null,
          );
          setOpen(nextOpen);
          if (!nextOpen) {
            setSearch("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "justify-between gap-3",
              !selectedOption && "text-secondary",
              className,
              triggerClassName,
            )}
            disabled={disabled}
          >
            <span className="min-w-0 flex-1 truncate text-left">
              {selectedOption?.label || placeholder}
            </span>
            <ChevronDownIcon className="size-5 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          container={resolvedPortalContainer}
          className={cn(
            "w-(--radix-popover-trigger-width) p-3",
            contentClassName,
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="text-secondary pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-80" />
              <Input
                ref={searchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 pl-9"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pr-1">
              {allowClear ? (
                <button
                  type="button"
                  onClick={() => commitValue("")}
                  className={cn(
                    "flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    value === ""
                      ? "text-primary bg-white"
                      : "hover:text-primary text-body hover:bg-white",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{emptyLabel}</span>
                </button>
              ) : null}

              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => commitValue(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        option.disabled && "cursor-not-allowed opacity-50",
                        isSelected
                          ? "text-primary bg-white"
                          : "hover:text-primary text-body hover:bg-white",
                      )}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        {isSelected ? (
                          <CheckIcon className="text-primary size-4" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1 truncate">
                        {option.label}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-secondary px-3 py-2 text-sm">
                  {noResultsLabel}
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
