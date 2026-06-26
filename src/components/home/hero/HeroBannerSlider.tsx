"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, CirclePlus } from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";

type HeroBannerSliderProps = {
  banners: Banner[];
};

const FALLBACK_BANNER: Banner = {
  id: 0,
  title:
    "Sàn kết nối bất động sản cho thuê số 1 Việt Nam nơi đáp ứng mọi nhu cầu thuê và cho thuê",
  imageUrl: "/imgs/wallpaper-3.jpg",
  imagePublicId: null,
  targetLink: null,
  page: "home",
  position: "top",
  sortOrder: 1,
  isActive: true,
  createdAt: new Date().toISOString(),
};

function getSlides(banners: Banner[]) {
  const heroSlides = banners
    .filter((banner) => banner.position === "top" && banner.isActive)
    .slice()
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.id - right.id;
    });

  return heroSlides.length > 0 ? heroSlides : [FALLBACK_BANNER];
}

function isExternalLink(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

function SlideLink({ href, children }: { href: string; children: ReactNode }) {
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="block h-full w-full"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full w-full">
      {children}
    </Link>
  );
}

export default function HeroBannerSlider({ banners }: HeroBannerSliderProps) {
  const slides = useMemo(() => getSlides(banners), [banners]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: slides.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;

    const interval = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 6500);

    return () => window.clearInterval(interval);
  }, [emblaApi, slides.length]);

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        <div
          className="h-full w-full overflow-hidden"
          ref={emblaRef}
          aria-label="Hero banner slider"
        >
          <div className="flex h-full touch-pan-y">
            {slides.map((slide) => {
              const SlideInner = (
                <div className="relative h-full w-full">
                  <CloudinaryImage
                    src={slide.imageUrl}
                    alt={slide.title}
                    width={1600}
                    height={900}
                    priority={slide.id === slides[0]?.id}
                    sizes="100vw"
                    cldQuality="auto:best"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/60" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-black/35" />
                </div>
              );

              return (
                <div
                  key={slide.id}
                  className="min-w-0 shrink-0 basis-full overflow-hidden"
                >
                  {slide.targetLink ? (
                    <SlideLink href={slide.targetLink}>{SlideInner}</SlideLink>
                  ) : (
                    SlideInner
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        <div className="layout-container relative flex h-full flex-col items-center justify-center py-16 text-center sm:py-20 md:py-28">
          <h1 className="mt-6 max-w-5xl text-3xl leading-tight font-extrabold tracking-[-0.04em] text-white drop-shadow-xl md:text-4xl lg:text-5xl">
            Sàn Thương Mại Bất Động Sản Kết Nối Nhu Cầu Thuê - Cho Thuê Toàn
            Quốc
          </h1>

          <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-3 md:grid-cols-2 xl:mt-10 xl:gap-4">
            <Button
              asChild
              size="lg"
              className="group bg-primary h-auto min-h-16 w-full justify-between gap-3 rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-bold text-white shadow-2xl transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-2xl sm:px-5 sm:py-4 lg:min-h-20 lg:px-6 lg:text-base"
            >
              <Link href="/dang-tin/cho-thue">
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <span className="text-lg font-semibold">
                    Đăng tin cho thuê ngay
                  </span>
                  <span className="text-xs font-medium text-white/75">
                    Tiếp cận khách hàng tiềm năng
                  </span>
                </span>
                <CirclePlus className="size-4 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 lg:size-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-auto min-h-16 w-full justify-between gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 text-left text-sm font-bold text-black shadow-2xl transition-colors duration-300 hover:bg-white/95 hover:text-black sm:px-5 sm:py-4 lg:min-h-20 lg:px-6 lg:text-base"
            >
              <Link href="/dang-tin/can-thue">
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <span className="text-lg font-semibold">
                    Đăng nhu cầu cần thuê ngay
                  </span>
                  <span className="text-xs font-medium text-black/60">
                    Tiếp cận đơn vị cho thuê nhanh chóng
                  </span>
                </span>
                <CirclePlus className="size-4 shrink-0 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 lg:size-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-4 w-full max-w-4xl lg:mt-5">
            <div className="mb-2 text-center text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">
              Khám phá nhanh
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:gap-3">
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="group h-12 w-full justify-between rounded-full border border-white/25 bg-white px-4 text-xs font-semibold text-black shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-white/95 hover:text-black lg:h-14 lg:px-6 lg:text-sm"
              >
                <Link href="/cho-thue">
                  <span className="flex min-w-0 flex-1 items-center">
                    Xem bất động sản đang cho thuê
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 lg:size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="group h-12 w-full justify-between rounded-full border border-white/25 bg-white px-4 text-xs font-semibold text-black shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-white/95 hover:text-black lg:h-14 lg:px-6 lg:text-sm"
              >
                <Link href="/can-thue">
                  <span className="flex min-w-0 flex-1 items-center">
                    Xem nhu cầu cần thuê mới nhất
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 lg:size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "bg-primary w-8 shadow-lg"
                    : "bg-surface/45 hover:bg-surface/70 w-2.5",
                )}
                aria-label={`Chuyển đến banner ${index + 1}`}
                aria-pressed={index === selectedIndex}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
