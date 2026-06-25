import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "placeholder:text-secondary flex min-h-24 w-full rounded-lg border border-hairline-strong bg-surface px-3.5 py-2.5 text-base text-body shadow-lg outline-none transition-all hover:border-primary/20 hover:bg-white hover:shadow-xl focus-visible:border-primary/25 focus-visible:ring-4 focus-visible:ring-primary/12 disabled:cursor-not-allowed disabled:bg-subtle/60 disabled:text-secondary disabled:opacity-100 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

