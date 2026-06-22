"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Building2, ClipboardList, Search, UsersRound } from "lucide-react";

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
                  <div className="absolute inset-0 bg-[rgba(28,20,12,0.18)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,20,12,0.08),rgba(28,20,12,0.48))]" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(28,20,12,0.34))]" />
                </div>
              );

              return (
                <div
                  key={slide.id}
                  className="min-w-0 flex-[0_0_100%] overflow-hidden"
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
          <h1 className="mt-6 max-w-5xl text-3xl leading-tight font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.42)] md:text-5xl lg:text-6xl">
            Sàn kết nối bất động sản nơi đáp ứng mọi nhu cầu thuê và cho thuê
          </h1>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 w-full max-w-72 rounded-xl px-8 text-base font-bold shadow-[0_0_0_4px_rgba(251,170,25,0.18),0_18px_46px_rgba(251,170,25,0.28)] sm:w-auto sm:min-w-64"
            >
              <Link href="/dang-tin/cho-thue">
                <Building2 className="size-5" />
                Đăng tin cho thuê
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 w-full max-w-72 rounded-xl px-8 text-base font-bold shadow-[0_18px_46px_rgba(0,0,0,0.18)] sm:w-auto sm:min-w-64"
            >
              <Link href="/dang-tin/can-thue">
                <ClipboardList className="size-5" />
                Đăng nhu cầu cần thuê
              </Link>
            </Button>
          </div>

          <div className="mt-5 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border-surface/20 bg-surface/10 hover:bg-surface/15 h-12 w-full max-w-72 rounded-full border px-6 text-sm font-semibold text-white backdrop-blur-sm hover:text-white sm:w-auto sm:min-w-60"
            >
              <Link href="/cho-thue">
                <Search className="size-4" />
                Xem mặt bằng cho thuê
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="border-surface/20 bg-surface/10 hover:bg-surface/15 h-12 w-full max-w-72 rounded-full border px-6 text-sm font-semibold text-white backdrop-blur-sm hover:text-white sm:w-auto sm:min-w-60"
            >
              <Link href="/can-thue">
                <UsersRound className="size-4" />
                Xem nhu cầu cần thuê
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-full bg-[rgba(28,20,12,0.18)] px-3 py-2 backdrop-blur-md">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "bg-primary w-8 shadow-[0_0_0_4px_rgba(251,170,25,0.18)]"
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
