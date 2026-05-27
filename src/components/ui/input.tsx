import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted h-11 w-full min-w-0 rounded-lg border border-black/8 bg-white px-3.5 py-2 text-base text-body shadow-[0_10px_24px_rgba(15,23,42,0.05)] outline-none transition-all file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-primary/20 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)] focus-visible:border-primary/25 focus-visible:ring-4 focus-visible:ring-primary/12 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black/3 disabled:text-muted disabled:opacity-100 read-only:bg-subtle/60 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/12 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
