"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import CloudinaryImage from "@/components/common/CloudinaryImage";

type PropertyImageGalleryProps = {
  title: string;
  images: string[];
};

export default function PropertyImageGallery({
  title,
  images,
}: PropertyImageGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage =
    safeImages[activeIndex] || safeImages[0] || "/imgs/wallpaper-1.jpg";

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-2xl bg-surface-alt lg:h-96">
        <CloudinaryImage
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          cldQuality="auto:best"
          className="object-cover"
        />
        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-lg bg-surface/92 p-2 text-body shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition-colors duration-200 ease-in-out hover:bg-primary hover:text-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg bg-surface/92 p-2 text-body shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition-colors duration-200 ease-in-out hover:bg-primary hover:text-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}
        <div className="absolute right-3 bottom-3 rounded-md bg-[rgba(28,20,12,0.6)] px-2 py-1 text-sm font-semibold text-white">
          {activeIndex + 1}/{safeImages.length}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-1">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg ${index === activeIndex ? "ring-primary ring-2" : "ring-1 ring-hairline"}`}
            aria-label={`Xem ảnh ${index + 1}`}
          >
            <CloudinaryImage
              src={image}
              alt={`${title} - ảnh ${index + 1}`}
              fill
              sizes="96px"
              cldQuality="auto:good"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
