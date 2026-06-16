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
  title: "Sàn kết nối mặt bằng cho thuê và nhu cầu cần thuê",
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

  const title = slides[selectedIndex]?.title || FALLBACK_BANNER.title;
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
                    fill
                    priority={slide.id === slides[0]?.id}
                    sizes="100vw"
                    cldQuality="auto:best"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.46))]" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(10,10,10,0.38))]" />
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
        <div className="layout-container relative flex h-full flex-col items-center justify-center py-28 text-center">
          <h1 className="mt-6 max-w-5xl text-4xl leading-tight font-extrabold tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.42)] lg:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 font-light text-white/82 drop-shadow-[0_6px_22px_rgba(0,0,0,0.34)] md:text-xl md:leading-9">
            Đăng mặt bằng, đăng nhu cầu hoặc khám phá nguồn cung và khách thuê
            đang có trên sàn.
          </p>

          <div className="mt-12 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 w-full max-w-72 rounded-xl px-8 text-base font-bold shadow-[0_0_0_4px_rgba(251,170,25,0.24),0_18px_46px_rgba(251,170,25,0.38)] sm:w-auto sm:min-w-64"
            >
              <Link href="/dang-tin/cho-thue">
                <Building2 className="size-5" />
                Đăng tin cho thuê
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="text-heading hover:text-primary h-14 w-full max-w-72 rounded-xl bg-white px-8 text-base font-bold shadow-[0_18px_46px_rgba(0,0,0,0.22)] hover:bg-white sm:w-auto sm:min-w-64"
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
              className="h-12 w-full max-w-72 rounded-full border border-white/18 bg-white/8 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/14 hover:text-white sm:w-auto sm:min-w-60"
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
              className="h-12 w-full max-w-72 rounded-full border border-white/18 bg-white/8 px-6 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/14 hover:text-white sm:w-auto sm:min-w-60"
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
          <div className="flex items-center gap-2 rounded-full bg-black/18 px-3 py-2 backdrop-blur-md">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2.5 cursor-pointer rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "bg-primary w-8 shadow-[0_0_0_4px_rgba(251,170,25,0.22)]"
                    : "w-2.5 bg-white/45 hover:bg-white/70",
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

