"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageSkeleton } from "@/components/common/Skeleton";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  cldQuality?: "auto" | "auto:good" | number;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  containerClassName?: string;
};

export default function CloudinaryImage({
  src,
  cldQuality = "auto:good",
  fallbackSrc = "/imgs/fallback.webp",
  showSkeleton = true,
  skeletonClassName,
  containerClassName,
  ...props
}: CloudinaryImageProps) {
  const {
    alt,
    title,
    loading,
    priority,
    className,
    style,
    onLoad,
    onError,
    ...rest
  } = props;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedTitle = title ?? alt ?? "";
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const canUseFallback = Boolean(fallbackSrc && fallbackSrc !== src);
  const currentSrc =
    canUseFallback && failedSrc === src ? (fallbackSrc as string) : src;
  const isLoaded = loadedSrc === currentSrc;

  const resolvedQuality =
    typeof cldQuality === "number"
      ? cldQuality
      : cldQuality === "auto:good"
        ? 75
        : 70;

  return (
    <span
      className={cn(
        "relative block overflow-hidden",
        className,
        containerClassName,
      )}
    >
      <Image
        src={currentSrc}
        alt={alt ?? ""}
        title={resolvedTitle}
        loading={resolvedLoading}
        quality={resolvedQuality}
        className={cn("transition-opacity duration-300", className)}
        style={isLoaded ? style : { ...style, opacity: 0 }}
        onLoad={(event) => {
          setLoadedSrc(currentSrc);
          onLoad?.(event);
        }}
        onError={(event) => {
          if (canUseFallback && currentSrc === src) {
            setFailedSrc(src);
            setLoadedSrc(null);
            return;
          }

          setLoadedSrc(currentSrc);
          onError?.(event);
        }}
        {...rest}
      />
      {showSkeleton && !isLoaded ? (
        <ImageSkeleton className={skeletonClassName} />
      ) : null}
    </span>
  );
}
