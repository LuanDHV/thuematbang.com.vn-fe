"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface PropertyFilterChipPopoverProps {
  label: string;
  title: string;
  children: React.ReactNode;
  onApply: () => void;
  onReset: () => void;
  isActive?: boolean;
}

const triggerBaseClass =
  "flex h-10 min-w-35 cursor-pointer items-center justify-between gap-2 rounded-xl border-gray-200 bg-white px-4 text-xs font-medium whitespace-nowrap transition-all hover:bg-gray-50 focus:ring-0";
const bodyClass =
  "max-h-75 overflow-y-auto p-4 [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1";
const footerButtonClass =
  "cursor-pointer rounded-lg px-4 text-xs font-medium tracking-wider uppercase";

export function PropertyFilterChipPopover({
  label,
  title,
  children,
  onApply,
  onReset,
  isActive = false,
}: PropertyFilterChipPopoverProps) {
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
            isActive ? "border-primary text-primary" : "text-gray-600"
          }`}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-[min(92vw,320px)] overflow-hidden rounded-2xl border-gray-100 p-0 shadow-xl"
      >
        <div className="border-gray-100p-4 border-b">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>

        <div className={bodyClass}>{children}</div>

        <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-white p-3">
          <Button
            variant="outline"
            onClick={onReset}
            className={`border-primary text-primary hover:border-primary hover:bg-primary/10 border bg-transparent ${footerButtonClass}`}
          >
            Đặt lại
          </Button>
          <Button
            onClick={handleApply}
            className={`bg-primary hover:bg-primary/90 text-white ${footerButtonClass}`}
          >
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
