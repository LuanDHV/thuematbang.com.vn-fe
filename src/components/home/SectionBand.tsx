import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionBandTone = "primary" | "secondary";

interface SectionBandProps {
  children: ReactNode;
  className?: string;
  tone?: SectionBandTone;
}

const toneClassMap: Record<SectionBandTone, string> = {
  primary: "bg-white",
  secondary: "bg-app",
};
export default function SectionBand({
  children,
  className,
  tone = "primary",
}: SectionBandProps) {
  return (
    <section
      className={cn(
        "border-hairline/80 w-full border-t",
        toneClassMap[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}
