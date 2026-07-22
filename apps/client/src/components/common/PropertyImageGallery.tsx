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
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import {
  sanitizeAnalyticsText,
  trackEvent,
  type AnalyticsEventParams,
} from "@/lib/analytics/track-event";
import { optimizeCloudinaryByPreset } from "@/lib/cloudinary";

type PropertyImageGalleryProps = {
  title: string;
  images: string[];
  analytics?: {
    source: string;
    listingType: string;
    listingId: number;
    listingTitle?: string | null;
    listingCode?: string | null;
    categoryId?: number | null;
    categoryName?: string | null;
    provinceId?: number | null;
    provinceName?: string | null;
    wardId?: number | null;
    wardName?: string | null;
    priceAmount?: number | null;
    priceUnit?: string | null;
    area?: number | null;
    priorityStatus?: string | null;
  };
};

const FALLBACK_IMAGE = "/imgs/rent-request-thumbnail/can-ho-chung-cu.webp";
const GALLERY_HISTORY_STATE_KEY = "__thuematbangGalleryOpen";

export default function PropertyImageGallery({
  title,
  images,
  analytics,
}: PropertyImageGalleryProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const rawDisplayImages = useMemo(
    () => (safeImages.length > 0 ? safeImages : [FALLBACK_IMAGE]),
    [safeImages],
  );
  const displayImages = rawDisplayImages;
  const thumbnailImages = rawDisplayImages;
  const slides = useMemo(
    () =>
      displayImages.map((src, index) => ({
        src: optimizeCloudinaryByPreset(src, "listingGalleryMain"),
        alt: `${title} - ảnh ${index + 1}`,
        thumbnail:
          optimizeCloudinaryByPreset(
            thumbnailImages[index] || src,
            "listingGalleryThumb",
          ) || src,
      })),
    [displayImages, thumbnailImages, title],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [activeImageOrientation, setActiveImageOrientation] = useState<
    "portrait" | "landscape" | "square" | null
  >(null);
  const preloadedImagesRef = useRef(new Set<string>());
  const viewerOpenRef = useRef(false);
  const hasGalleryHistoryEntryRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const currentActiveIndex = Math.min(activeIndex, displayImages.length - 1);
  const currentViewerIndex = Math.min(viewerIndex, displayImages.length - 1);
  const activeImage = displayImages[currentActiveIndex] || displayImages[0];
  const optimizedActiveImage = optimizeCloudinaryByPreset(
    activeImage,
    "listingGalleryMain",
  );

  useEffect(() => {
    if (displayImages.length <= 1 || typeof window === "undefined") return;

    const preload = (src: string | undefined) => {
      const optimizedSrc = src
        ? optimizeCloudinaryByPreset(src, "listingGalleryMain")
        : "";
      if (!optimizedSrc || preloadedImagesRef.current.has(optimizedSrc)) return;
      preloadedImagesRef.current.add(optimizedSrc);
      const image = new window.Image();
      image.src = optimizedSrc;
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

    image.src = optimizedActiveImage;

    return () => {
      cancelled = true;
    };
  }, [activeImage, optimizedActiveImage]);

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

  useEffect(() => {
    viewerOpenRef.current = viewerOpen;
  }, [viewerOpen]);

  useEffect(() => {
    const closeViewerOnBack = () => {
      if (!viewerOpenRef.current || !hasGalleryHistoryEntryRef.current) {
        return;
      }

      hasGalleryHistoryEntryRef.current = false;
      viewerOpenRef.current = false;
      setViewerOpen(false);
    };

    window.addEventListener("popstate", closeViewerOnBack);

    return () => {
      window.removeEventListener("popstate", closeViewerOnBack);
    };
  }, []);

  const pushViewerHistoryEntry = () => {
    if (typeof window === "undefined" || hasGalleryHistoryEntryRef.current) {
      return;
    }

    const state =
      typeof window.history.state === "object" && window.history.state !== null
        ? window.history.state
        : {};

    window.history.pushState(
      {
        ...state,
        [GALLERY_HISTORY_STATE_KEY]: true,
      },
      "",
      window.location.href,
    );
    hasGalleryHistoryEntryRef.current = true;
  };

  const closeViewer = () => {
    if (hasGalleryHistoryEntryRef.current) {
      window.history.back();
      return;
    }

    viewerOpenRef.current = false;
    setViewerOpen(false);
  };

  const openViewer = () => {
    setViewerIndex(currentActiveIndex);
    pushViewerHistoryEntry();
    viewerOpenRef.current = true;
    setViewerOpen(true);
    const trackingParams: AnalyticsEventParams = {
      source: analytics?.source ?? "listing_gallery",
      listing_type: analytics?.listingType,
      listing_id: analytics?.listingId,
      listing_title: sanitizeAnalyticsText(analytics?.listingTitle ?? title),
      display_code: analytics?.listingCode,
      category_id: analytics?.categoryId,
      category_name: sanitizeAnalyticsText(analytics?.categoryName),
      province_id: analytics?.provinceId,
      province_name: sanitizeAnalyticsText(analytics?.provinceName),
      ward_id: analytics?.wardId,
      ward_name: sanitizeAnalyticsText(analytics?.wardName),
      price_amount: analytics?.priceAmount,
      price_unit: analytics?.priceUnit,
      priority_status: analytics?.priorityStatus,
      image_count: displayImages.length,
    };
    trackEvent(ANALYTICS_EVENTS.listingGalleryOpened, trackingParams);
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
          cloudinaryPreset="listingGalleryMain"
          aria-hidden
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="pointer-events-none h-full w-full scale-105 object-cover opacity-70 blur-2xl"
          fallbackSrc={FALLBACK_IMAGE}
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
              cloudinaryPreset="listingGalleryMain"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              className={`h-full w-full ${activeImageClassName}`}
              fallbackSrc={FALLBACK_IMAGE}
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
              src={thumbnailImages[index] || image}
              alt={`${title} - ảnh ${index + 1}`}
              cloudinaryPreset="listingGalleryThumb"
              sizes="96px"
              className="h-full w-full object-cover"
              fallbackSrc={FALLBACK_IMAGE}
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={viewerOpen}
        close={closeViewer}
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
