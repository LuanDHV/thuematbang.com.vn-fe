"use client";

import Image, { type ImageProps } from "next/image";
import { isCloudinaryImageUrl } from "@/lib/cloudinary";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  cldQuality?: "auto" | "auto:good" | "auto:best";
};

export default function CloudinaryImage({
  src,
  cldQuality = "auto:good",
  ...props
}: CloudinaryImageProps) {
  const { alt, title, loading, priority, ...rest } = props;
  const resolvedTitle = title ?? alt ?? "";
  const resolvedLoading = loading ?? (priority ? "eager" : "lazy");

  const resolvedQuality =
    typeof cldQuality === "number"
      ? cldQuality
      : cldQuality === "auto:best"
        ? 90
        : 85;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      title={resolvedTitle}
      loading={resolvedLoading}
      quality={resolvedQuality}
      unoptimized={isCloudinaryImageUrl(src)}
      {...rest}
    />
  );
}
