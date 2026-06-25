import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionBandTone = "app" | "surface";

interface SectionBandProps {
  children: ReactNode;
  className?: string;
  tone?: SectionBandTone;
}

const toneClassMap: Record<SectionBandTone, string> = {
  app: "bg-app",
  surface: "bg-surface",
};

export default function SectionBand({
  children,
  className,
  tone = "surface",
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
