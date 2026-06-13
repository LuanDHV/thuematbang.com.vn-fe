import { Building2, ClipboardList, Search, UsersRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full items-center justify-center overflow-hidden bg-[url('/imgs/wallpaper-3.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.48))]" />

      <div className="layout-container relative z-10 flex flex-col items-center text-center">
        <h1 className="max-w-5xl text-4xl leading-tight font-extrabold tracking-tight text-white uppercase lg:text-6xl">
          Sàn kết nối mặt bằng cho thuê và nhu cầu cần thuê
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-8 font-light text-white/82 md:text-xl md:leading-9">
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
    </section>
  );
}
