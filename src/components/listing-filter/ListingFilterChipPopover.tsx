"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ListingFilterChipPopoverProps {
  label: string;
  title: string;
  children: React.ReactNode;
  onApply: () => void;
  onReset: () => void;
  isActive?: boolean;
}

const triggerBaseClass =
  "flex h-10 min-w-35 items-center justify-between gap-2 rounded-lg border border-hairline bg-surface px-4 text-xs font-medium whitespace-nowrap text-body shadow-lg transition-all hover:border-primary/20 hover:bg-white hover:text-primary focus:ring-0";
const bodyClass =
  "max-h-75 overflow-y-auto p-4 [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1";
const footerButtonClass =
  "cursor-pointer rounded-lg px-4 text-xs font-medium tracking-wider uppercase";

export function ListingFilterChipPopover({
  label,
  title,
  children,
  onApply,
  onReset,
  isActive = false,
}: ListingFilterChipPopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`${triggerBaseClass} ${
            isActive ? "border-primary/30 bg-white text-primary" : ""
          }`}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="size-5 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-full max-w-xs overflow-hidden rounded-2xl p-0"
      >
        <div className="border-b border-hairline p-4">
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
        </div>

        <div className={bodyClass}>{children}</div>

        <div className="flex items-center justify-between gap-2 border-t border-hairline bg-surface p-3">
          <Button variant="outline" onClick={onReset} className={footerButtonClass}>
            Đặt lại
          </Button>
          <Button onClick={handleApply} className={footerButtonClass}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
