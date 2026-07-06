"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowRight,
  CirclePlus,
  Sparkles,
  BadgeCheck,
  Zap,
} from "lucide-react";

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
  imageUrl: "/imgs/wallpaper-7.jpg",
  imagePublicId: null,
  targetLink: null,
  page: "home",
  position: "top",
  sortOrder: 1,
  isActive: true,
  createdAt: new Date().toISOString(),
};

const heroBadges = [
  { label: "Xác thực nội dung", icon: BadgeCheck },
  { label: "Cập nhật liên tục", icon: Sparkles },
  { label: "Kết nối nhanh", icon: Zap },
] as const;

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

type HeroActionCardProps = {
  primaryHref: string;
  primaryLabel: string;
  primaryDescription: string;
  secondaryHref: string;
  secondaryLabel: string;
  secondaryDescription: string;
  primaryIcon: ReactNode;
  secondaryIcon: ReactNode;
  className?: string;
};

function HeroActionCard({
  primaryHref,
  primaryLabel,
  primaryDescription,
  secondaryHref,
  secondaryLabel,
  secondaryDescription,
  primaryIcon,
  secondaryIcon,
  className,
}: HeroActionCardProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Button
        asChild
        size="lg"
        className="group bg-primary h-auto min-h-16 w-full justify-between gap-3 rounded-2xl border border-white/15 px-4 py-3 text-left text-sm font-bold text-white shadow-2xl transition-[background-color,border-color,filter,transform] duration-500 ease-out hover:-translate-y-0.5 hover:border-white/25 hover:brightness-105 sm:px-5 sm:py-4 lg:min-h-20 lg:px-6 lg:text-base"
      >
        <Link href={primaryHref}>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span className="text-lg font-semibold">{primaryLabel}</span>
            <span className="text-xs font-medium text-white/75">
              {primaryDescription}
            </span>
          </span>
          {primaryIcon}
        </Link>
      </Button>

      <Button
        asChild
        variant="ghost"
        size="lg"
        className="group border-border-subtle text-heading hover:border-border-strong hover:bg-surface mt-3 h-auto min-h-14 w-full justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm font-bold shadow-lg transition-[background-color,border-color,filter,transform] duration-500 ease-out hover:-translate-y-0.5 hover:brightness-[1.02] sm:px-5 sm:py-4 lg:min-h-16 lg:px-6 lg:text-base"
      >
        <Link href={secondaryHref}>
          <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span className="text-base font-semibold sm:text-lg">
              {secondaryLabel}
            </span>
            <span className="text-secondary text-xs font-medium">
              {secondaryDescription}
            </span>
          </span>
          {secondaryIcon}
        </Link>
      </Button>
    </div>
  );
}

function HeroBadgeStrip({ visible }: { visible: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
      style={{ transitionDelay: visible ? "120ms" : "0ms" }}
    >
      {heroBadges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <span
            key={badge.label}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-md"
            style={{ transitionDelay: `${160 + index * 80}ms` }}
          >
            <Icon className="text-primary size-3.5" />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}

export default function HeroBannerSlider({ banners }: HeroBannerSliderProps) {
  const slides = useMemo(() => getSlides(banners), [banners]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: slides.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                    cldQuality="auto:good"
                    className={cn(
                      "h-full w-full object-cover object-center transition-transform duration-1200 ease-out",
                      mounted ? "scale-100" : "scale-[1.08]",
                    )}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/15 to-black/35" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent to-black/35" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.22),transparent_20%)]" />
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
        <div className="layout-container relative flex h-full flex-col px-4 py-10 sm:px-6 sm:py-14 md:py-24 lg:py-28">
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="flex w-full max-w-6xl flex-col items-center">
              <h1
                className={cn(
                  "mt-0 max-w-5xl text-2xl leading-tight font-bold tracking-tighter text-white uppercase drop-shadow-xl transition-all duration-700 ease-out sm:mt-6 sm:text-3xl md:text-4xl lg:text-5xl",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: mounted ? "120ms" : "0ms" }}
              >
                Nền tảng kết nối <br /> bất động sản cho thuê toàn quốc
              </h1>

              <p
                className={cn(
                  "mt-3 max-w-3xl text-xs leading-6 text-white/82 transition-all duration-700 ease-out sm:mt-5 sm:text-base sm:leading-7 md:text-lg",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: mounted ? "220ms" : "0ms" }}
              >
                Tìm, đăng và kết nối nhanh hơn với những tin cho thuê, cần thuê
                được cập nhật liên tục trên hệ thống.
              </p>

              <div className="mt-4 hidden w-full max-w-4xl sm:mt-6 sm:block">
                <HeroBadgeStrip visible={mounted} />
              </div>

              <div
                className={cn(
                  "mt-5 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-8 sm:gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-5",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: mounted ? "320ms" : "0ms" }}
              >
                <HeroActionCard
                  primaryHref="/dang-tin/cho-thue"
                  primaryLabel="Đăng tin cho thuê"
                  primaryDescription="Kết nối mạng lưới khách thuê nhanh chóng"
                  secondaryHref="/can-thue"
                  secondaryLabel="Xem nhu cầu cần thuê mới nhất"
                  secondaryDescription="Nắm bắt nhu cầu của thị trường"
                  primaryIcon={
                    <CirclePlus className="size-4 shrink-0 opacity-80 transition-transform duration-500 ease-out group-hover:translate-x-1 lg:size-5" />
                  }
                  secondaryIcon={
                    <ArrowRight className="size-4 shrink-0 opacity-70 transition-transform duration-500 ease-out group-hover:translate-x-1 lg:size-5" />
                  }
                />

                <HeroActionCard
                  primaryHref="/dang-tin/can-thue"
                  primaryLabel="Đăng tin cần thuê"
                  primaryDescription="Tiếp cận nguồn cung phù hợp"
                  secondaryHref="/cho-thue"
                  secondaryLabel="Xem bất động sản đang cho thuê"
                  secondaryDescription="Khám phá các lựa chọn đa dạng"
                  primaryIcon={
                    <CirclePlus className="size-4 shrink-0 opacity-80 transition-transform duration-500 ease-out group-hover:translate-x-1 lg:size-5" />
                  }
                  secondaryIcon={
                    <ArrowRight className="size-4 shrink-0 opacity-70 transition-transform duration-500 ease-out group-hover:translate-x-1 lg:size-5" />
                  }
                />
              </div>
            </div>
          </div>

          <div
            className={cn(
              "mt-auto hidden justify-center py-4 transition-all duration-700 ease-out sm:flex sm:py-8",
              mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
            style={{ transitionDelay: mounted ? "420ms" : "0ms" }}
          >
            <Link
              href="tel:0968688081"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 transition hover:border-white/18 hover:bg-white/20"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-footer-body text-sm font-bold tracking-[0.12em] uppercase">
                Hotline
              </span>
              <span className="h-3.5 w-px bg-white/15" />
              <span className="text-primary text-base font-bold tracking-wide whitespace-nowrap">
                0968 68 80 81
              </span>
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center px-4 sm:bottom-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-md">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "h-2.5 cursor-pointer rounded-full transition-all duration-500 ease-out",
                  index === selectedIndex
                    ? "bg-primary w-8 shadow-lg"
                    : "bg-surface/45 hover:bg-surface/60 w-2.5",
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
