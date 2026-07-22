"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { ImageSkeleton } from "@/components/common/Skeleton";
import {
  CLOUDINARY_PRESETS,
  isCloudinaryImageUrl,
  optimizeCloudinaryByPreset,
  type CloudinaryPresetName,
} from "@/lib/cloudinary";

type CloudinaryImageProps = Omit<ImageProps, "src" | "width" | "height" | "quality"> & {
  src: string;
  cloudinaryPreset?: CloudinaryPresetName;
  fallbackSrc?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  quality?: number;
};

export default function CloudinaryImage({
  src,
  cloudinaryPreset,
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
    width,
    height,
    quality,
    className,
    style,
    onLoad,
    onError,
    ...rest
  } = props;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const presetConfig = cloudinaryPreset ? CLOUDINARY_PRESETS[cloudinaryPreset] : null;
  const resolvedTitle = title ?? alt ?? "";
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
  const canUseFallback = Boolean(fallbackSrc && fallbackSrc !== src);
  const optimizedSrc =
    cloudinaryPreset && isCloudinaryImageUrl(src)
      ? optimizeCloudinaryByPreset(src, cloudinaryPreset)
      : src;
  const currentSrc =
    canUseFallback && failedSrc === src ? (fallbackSrc as string) : optimizedSrc;
  const isLoaded = loadedSrc === currentSrc;
  const resolvedWidth = width ?? presetConfig?.width;
  const resolvedHeight = height ?? presetConfig?.height;
  const resolvedQuality =
    typeof quality === "number"
      ? quality
      : presetConfig?.quality === 90
        ? 90
        : 75;

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
        unoptimized={isCloudinaryImageUrl(currentSrc)}
        width={resolvedWidth}
        height={resolvedHeight}
        quality={resolvedQuality}
        className={cn("transition-opacity duration-300", className)}
        style={isLoaded ? style : { ...style, opacity: 0 }}
        onLoad={(event) => {
          setLoadedSrc(currentSrc);
          onLoad?.(event);
        }}
        onError={(event) => {
          if (canUseFallback && currentSrc === optimizedSrc) {
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
