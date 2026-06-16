"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type HomeCarouselProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  options?: EmblaOptionsType;
};

export default function HomeCarousel({
  children,
  className,
  trackClassName,
  options,
}: HomeCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    align: "center",
    loop: true,
    dragFree: false,
    ...options,
  });

  return (
    <div className={cn("overflow-hidden lg:hidden", className)} ref={emblaRef}>
      <div className={cn("-ml-3 flex touch-pan-y", trackClassName)}>{children}</div>
    </div>
  );
}

