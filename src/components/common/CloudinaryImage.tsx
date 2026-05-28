"use client";

import Image, { type ImageProps } from "next/image";
import { CldImage } from "next-cloudinary";
import { getCloudinaryPublicId, isCloudinaryImageUrl } from "@/lib/cloudinary";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  src: string;
  cldQuality?: "auto" | "auto:good" | "auto:best";
  crop?: "fill" | "fit" | "limit" | "crop";
  gravity?: "auto";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
};

export default function CloudinaryImage({
  src,
  cldQuality = "auto:good",
  crop = "fill",
  gravity = "auto",
  format = "auto",
  ...props
}: CloudinaryImageProps) {
  const publicId = getCloudinaryPublicId(src);
  const { alt, ...rest } = props;

  if (isCloudinaryImageUrl(src) && publicId) {
    return (
      <CldImage
        src={publicId}
        quality={cldQuality}
        crop={crop}
        gravity={gravity}
        format={format}
        dpr="auto"
        alt={alt ?? ""}
        {...rest}
      />
    );
  }

  return <Image src={src} alt={alt ?? ""} {...rest} />;
}
