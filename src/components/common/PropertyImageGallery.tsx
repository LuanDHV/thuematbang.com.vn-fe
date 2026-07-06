"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import CloudinaryImage from "@/components/common/CloudinaryImage";

type PropertyImageGalleryProps = {
  title: string;
  images: string[];
};

const FALLBACK_IMAGE = "/imgs/wallpaper-1.jpg";

export default function PropertyImageGallery({
  title,
  images,
}: PropertyImageGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const displayImages = useMemo(
    () => (safeImages.length > 0 ? safeImages : [FALLBACK_IMAGE]),
    [safeImages],
  );
  const slides = useMemo(
    () =>
      displayImages.map((src, index) => ({
        src,
        alt: `${title} - ảnh ${index + 1}`,
        thumbnail: src,
      })),
    [displayImages, title],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [activeImageOrientation, setActiveImageOrientation] = useState<
    "portrait" | "landscape" | "square" | null
  >(null);
  const preloadedImagesRef = useRef(new Set<string>());
  const prefersReducedMotion = useReducedMotion();

  const currentActiveIndex = Math.min(activeIndex, displayImages.length - 1);
  const currentViewerIndex = Math.min(viewerIndex, displayImages.length - 1);
  const activeImage = displayImages[currentActiveIndex] || displayImages[0];

  useEffect(() => {
    if (displayImages.length <= 1 || typeof window === "undefined") return;

    const preload = (src: string | undefined) => {
      if (!src || preloadedImagesRef.current.has(src)) return;
      preloadedImagesRef.current.add(src);
      const image = new window.Image();
      image.src = src;
    };

    preload(displayImages[0]);
    preload(displayImages[currentActiveIndex + 1]);
    preload(displayImages[currentActiveIndex - 1]);
  }, [currentActiveIndex, displayImages]);

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
    setActiveIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const goNext = () => {
    setSlideDirection(1);
    setActiveIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  const goToIndex = (index: number) => {
    if (index === currentActiveIndex) return;
    setSlideDirection(index > currentActiveIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const openViewer = () => {
    setViewerIndex(currentActiveIndex);
    setViewerOpen(true);
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
  const activeImageClassName = isPortraitImage
    ? "object-contain"
    : "object-cover";

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Mở trình xem ảnh của ${title}`}
        onClick={openViewer}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openViewer();
          }
        }}
        className="bg-surface-alt relative h-64 cursor-zoom-in overflow-hidden rounded-2xl lg:h-96"
      >
        <CloudinaryImage
          src={activeImage}
          alt=""
          width={1200}
          height={800}
          aria-hidden
          sizes="(max-width: 1024px) 100vw, 66vw"
          cldQuality="auto:good"
          className="pointer-events-none h-full w-full scale-105 object-cover opacity-70 blur-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />

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
              cldQuality="auto:good"
              priority
              className={`h-full w-full ${activeImageClassName}`}
            />
          </motion.div>
        </AnimatePresence>

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              className="bg-surface/92 text-body hover:bg-primary absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-lg p-2 shadow-lg transition-colors duration-200 ease-in-out hover:text-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              className="bg-surface/92 text-body hover:bg-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-lg p-2 shadow-lg transition-colors duration-200 ease-in-out hover:text-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight size={18} />
            </button>
          </>
        ) : null}
        <div className="absolute right-3 bottom-3 rounded-md bg-black/50 px-2 py-1 text-sm font-semibold text-white">
          {currentActiveIndex + 1}/{displayImages.length}
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-1">
        {displayImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => goToIndex(index)}
            className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg ${index === currentActiveIndex ? "ring-primary ring-2" : "ring-hairline ring-1"}`}
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

      <Lightbox
        open={viewerOpen}
        close={() => setViewerOpen(false)}
        index={currentViewerIndex}
        slides={slides}
        plugins={[Fullscreen, Thumbnails, Zoom, Counter]}
        controller={{ closeOnBackdropClick: true }}
        counter={{
          separator: " / ",
          container: {
            style: {
              top: 16,
              left: 16,
              right: "auto",
              bottom: "auto",
            },
          },
        }}
        thumbnails={{
          position: "bottom",
          hidden: false,
          showToggle: false,
          width: 92,
          height: 60,
          gap: 10,
          borderRadius: 8,
          padding: 4,
          imageFit: "cover",
        }}
        on={{
          view: ({ index }) => {
            setViewerIndex(index);
            setActiveIndex(index);
          },
        }}
      />
    </div>
  );
}
