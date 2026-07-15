import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-secondary h-11 w-full min-w-0 rounded-lg border border-hairline-strong bg-surface px-3.5 py-2 text-base text-body shadow-lg outline-none transition-all file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-primary/20 hover:bg-white hover:shadow-xl focus-visible:border-primary/25 focus-visible:ring-4 focus-visible:ring-primary/12 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-subtle/60 disabled:text-secondary disabled:opacity-100 read-only:bg-subtle/60 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/12 md:text-sm",
        className,
      )}
      {...props}
    />
  );
});

export { Input };


