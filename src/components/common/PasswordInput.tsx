"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  revealLabel?: string;
};

export default function PasswordInput({
  className,
  revealLabel = "mật khẩu",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-12", className)}
        {...props}
      />
      <button
        type="button"
        aria-label={isVisible ? `Ẩn ${revealLabel}` : `Hiện ${revealLabel}`}
        aria-pressed={isVisible}
        onClick={() => setIsVisible((current) => !current)}
        className="text-secondary hover:bg-primary/6 hover:text-primary focus-visible:ring-primary/20 absolute top-1/2 right-1 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none active:-translate-y-1/2"
      >
        {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
