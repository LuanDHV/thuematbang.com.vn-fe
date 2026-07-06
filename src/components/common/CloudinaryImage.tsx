"use client";

import Image, { type ImageProps } from "next/image";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  cldQuality?: "auto" | "auto:good" | number;
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
      : cldQuality === "auto:good"
        ? 75
        : 70;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      title={resolvedTitle}
      loading={resolvedLoading}
      quality={resolvedQuality}
      {...rest}
    />
  );
}
