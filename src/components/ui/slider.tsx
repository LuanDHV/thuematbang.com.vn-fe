"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-elevated">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-primary focus-visible:ring-primary/15 block h-5 w-5 cursor-pointer rounded-full border-2 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-colors outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb className="border-primary focus-visible:ring-primary/15 block h-5 w-5 cursor-pointer rounded-full border-2 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition-colors outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}

export { Slider };
