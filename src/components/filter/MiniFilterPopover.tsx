"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface MiniFilterPopoverProps {
  label: string;
  title: string;
  children: React.ReactNode;
  onApply: () => void;
  onReset: () => void;
  isActive?: boolean;
}

export function MiniFilterPopover({
  label,
  title,
  children,
  onApply,
  onReset,
  isActive = false,
}: MiniFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
          className={`flex h-10 min-w-35 cursor-pointer items-center justify-between gap-2 rounded-xl border-gray-200 bg-white px-4 text-xs font-medium whitespace-nowrap transition-all hover:bg-gray-50 focus:ring-0 ${
            isActive ? "border-primary text-primary" : "text-gray-600"
          }`}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[min(92vw,320px)] overflow-hidden rounded-2xl border-gray-100 p-0 shadow-xl"
      >
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>

        {/* Body content passed from parent */}
        <div className="max-h-75 overflow-y-auto p-4 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
          {children}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 border-t border-gray-100 bg-white p-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="border-primary text-primary hover:border-primary hover:bg-primary/10 cursor-pointer rounded-lg border bg-transparent px-4 text-xs font-medium tracking-wider uppercase"
          >
            Đặt lại
          </Button>
          <Button
            onClick={handleApply}
            className="bg-primary cursor-pointer rounded-lg px-4 text-xs font-medium tracking-wider text-white uppercase shadow-lg hover:brightness-110"
          >
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
