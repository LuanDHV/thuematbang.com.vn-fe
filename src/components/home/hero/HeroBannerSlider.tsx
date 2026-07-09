"use client";

import { useEffect, useState, type ReactNode } from "react";

import Link from "next/link";
import { ArrowRight, CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESKTOP_BANNER_SRC = "/imgs/hero-banner-desktop.png";
const MOBILE_BANNER_SRC = "/imgs/hero-banner-mobile.png";

function HeroBackground({ mounted }: { mounted: boolean }) {
  return (
    <div className="absolute inset-0">
      <picture className="block h-full w-full">
        <source media="(max-width: 767px)" srcSet={MOBILE_BANNER_SRC} />
        <img
          src={DESKTOP_BANNER_SRC}
          alt="Thuê Mặt Bằng hero banner"
          className={cn(
            "h-full w-full object-cover object-center transition-transform duration-1200 ease-out",
            mounted ? "scale-100" : "scale-[1.08]",
          )}
        />
      </picture>
      <div className="absolute inset-0 bg-black/10" />
    </div>
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
        className="group bg-primary h-auto min-h-16 w-full justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-white transition-[background-color,filter,transform] duration-500 ease-out hover:brightness-105 sm:px-5 sm:py-4 md:mx-auto md:max-w-120 lg:min-h-20 lg:px-6 lg:text-base xl:mx-0 xl:max-w-none"
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
        className="group text-heading hover:bg-surface mt-3 h-auto min-h-14 w-full justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left text-sm font-bold transition-[background-color,filter,transform] duration-500 ease-out hover:brightness-105 sm:px-5 sm:py-4 md:mx-auto md:max-w-120 lg:min-h-16 lg:px-6 lg:text-base xl:mx-0 xl:max-w-none"
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

export default function HeroBannerSlider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <HeroBackground mounted={mounted} />

      <div className="absolute inset-0">
        <div className="layout-container relative flex h-full flex-col px-4 py-10 sm:px-6 sm:py-14 md:py-24 lg:py-28">
          <div className="flex flex-1 items-center justify-center text-center">
            <div className="flex w-full max-w-6xl flex-col items-center">
              <h1
                className={cn(
                  "mt-0 max-w-5xl text-2xl leading-tight font-bold tracking-tighter text-white uppercase transition-all duration-700 ease-out sm:mt-6 sm:text-3xl md:text-4xl lg:text-5xl",
                  mounted
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: mounted ? "120ms" : "0ms" }}
              >
                Nền tảng kết nối <br /> bất động sản cho thuê toàn quốc
              </h1>

              <div
                className={cn(
                  "mt-5 grid w-full max-w-4xl grid-cols-1 gap-3 sm:mt-8 sm:gap-4 xl:mt-10 xl:grid-cols-2 xl:gap-5",
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
                    <CirclePlus className="size-4 shrink-0 opacity-80 transition-transform duration-500 ease-out lg:size-5" />
                  }
                  secondaryIcon={
                    <ArrowRight className="size-4 shrink-0 opacity-70 transition-transform duration-500 ease-out lg:size-5" />
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
                    <CirclePlus className="size-4 shrink-0 opacity-80 transition-transform duration-500 ease-out lg:size-5" />
                  }
                  secondaryIcon={
                    <ArrowRight className="size-4 shrink-0 opacity-70 transition-transform duration-500 ease-out lg:size-5" />
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
              className="bg-footer inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 backdrop-blur-xl transition"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-sm font-bold tracking-[0.12em] text-white/90 uppercase">
                Hotline
              </span>
              <span className="h-3.5 w-px bg-white/50" />
              <span className="text-primary text-base font-bold tracking-wide whitespace-nowrap">
                0968 68 80 81
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
