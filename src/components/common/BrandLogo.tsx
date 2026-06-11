"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "header" | "footer" | "auth";
type BrandLogoTone = "dark" | "light";

type BrandLogoProps = {
  variant: BrandLogoVariant;
  tone?: BrandLogoTone;
  priority?: boolean;
  alt?: string;
  className?: string;
};

const VARIANT_CLASSES: Record<
  BrandLogoVariant,
  {
    wrapper: string;
    image: string;
  }
> = {
  header: {
    wrapper: "h-11 w-[10.5rem] sm:w-[11.5rem]",
    image: "object-contain",
  },
  footer: {
    wrapper: "h-20 w-[18rem] sm:h-24 sm:w-[20rem]",
    image: "object-contain",
  },
  auth: {
    wrapper: "h-10 w-[10.5rem] md:h-12 md:w-[11.5rem]",
    image: "object-contain",
  },
};

export default function BrandLogo({
  variant,
  tone = "dark",
  priority = false,
  alt = "Thuematbang.com.vn",
  className,
}: BrandLogoProps) {
  const styles = VARIANT_CLASSES[variant];
  const src =
    tone === "light" ? "/imgs/logo-TMB-white.png" : "/imgs/logo-TMB-black.png";

  return (
    <div className={cn("relative overflow-hidden", styles.wrapper, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
