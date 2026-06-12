import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CmsFormPageShellProps = {
  children: ReactNode;
  className?: string;
  size?: "sm";
};

const MAX_WIDTH_CLASSES: Record<NonNullable<CmsFormPageShellProps["size"]>, string> = {
  sm: "max-w-2xl",
};

export default function CmsFormPageShell({
  children,
  className,
  size = "sm",
}: CmsFormPageShellProps) {
  return (
    <section
      className={cn("mx-auto w-full space-y-5", MAX_WIDTH_CLASSES[size], className)}
    >
      {children}
    </section>
  );
}
