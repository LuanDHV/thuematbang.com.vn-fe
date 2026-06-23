"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [slideDirection, setSlideDirection] = useState(0);
  const [activeImageOrientation, setActiveImageOrientation] = useState<
    "portrait" | "landscape" | "square" | null
  >(null);
  const preloadedImagesRef = useRef(new Set<string>());
  const prefersReducedMotion = useReducedMotion();

  const activeImage =
    safeImages[activeIndex] || safeImages[0] || "/imgs/wallpaper-1.jpg";

  useEffect(() => {
    if (safeImages.length <= 1 || typeof window === "undefined") return;

    const preload = (src: string | undefined) => {
      if (!src || preloadedImagesRef.current.has(src)) return;
      preloadedImagesRef.current.add(src);
      const image = new window.Image();
      image.src = src;
    };

    preload(safeImages[0]);
    preload(safeImages[activeIndex + 1]);
    preload(safeImages[activeIndex - 1]);
  }, [activeIndex, safeImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const image = new window.Image();

    image.onload = () => {
      if (cancelled) return;

      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;

      if (!width || !height) {
        setActiveImageOrientation(null);
        return;
      }

      if (Math.abs(width - height) <= 24) {
        setActiveImageOrientation("square");
        return;
      }

      setActiveImageOrientation(width < height ? "portrait" : "landscape");
    };

    image.onerror = () => {
      if (!cancelled) {
        setActiveImageOrientation(null);
      }
    };

    image.src = activeImage;

    return () => {
      cancelled = true;
    };
  }, [activeImage]);

  const goPrev = () => {
    setSlideDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setSlideDirection(1);
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex) return;
    setSlideDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: prefersReducedMotion ? 0 : direction > 0 ? 28 : -28,
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.02,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: prefersReducedMotion ? 0 : direction > 0 ? -28 : 28,
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.02,
    }),
  } as const;

  const isPortraitImage = activeImageOrientation === "portrait";
  const activeImageCrop = isPortraitImage ? "fit" : "fill";
  const activeImageClassName = isPortraitImage
    ? "object-contain"
    : "object-cover";

  return (
    <div>
      <div className="bg-surface-alt relative h-64 overflow-hidden rounded-2xl lg:h-96">
        <CloudinaryImage
          src={activeImage}
          alt=""
          width={1200}
          height={800}
          aria-hidden
          sizes="(max-width: 1024px) 100vw, 66vw"
          cldQuality="auto:good"
          className="pointer-events-none h-full w-full scale-110 object-cover opacity-70 blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--overlay-soft) via-transparent to-transparent" />

        <AnimatePresence initial={false} custom={slideDirection} mode="sync">
          <motion.div
            key={activeImage}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <CloudinaryImage
              src={activeImage}
              alt={title}
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 66vw"
              cldQuality="auto:best"
              crop={activeImageCrop}
              priority={activeIndex === 0}
              className={`h-full w-full ${activeImageClassName}`}
            />
          </motion.div>
        </AnimatePresence>

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="bg-surface/92 text-body hover:bg-primary absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-lg p-2 shadow-(--shadow-card) transition-colors duration-200 ease-in-out hover:text-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="bg-surface/92 text-body hover:bg-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg p-2 shadow-(--shadow-card) transition-colors duration-200 ease-in-out hover:text-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}
        <div className="absolute right-3 bottom-3 rounded-md bg-(--overlay-strong) px-2 py-1 text-sm font-semibold text-white">
          {activeIndex + 1}/{safeImages.length}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-1">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => goToIndex(index)}
            className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg ${index === activeIndex ? "ring-primary ring-2" : "ring-hairline ring-1"}`}
            aria-label={`Xem ảnh ${index + 1}`}
          >
            <CloudinaryImage
              src={image}
              alt={`${title} - ảnh ${index + 1}`}
              width={240}
              height={160}
              sizes="96px"
              cldQuality="auto:good"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
