import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-[url('/imgs/wallpaper-3.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex w-full flex-col items-center px-4 text-center">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
          Lorem ipsum dolor sit amet elit.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light text-gray-300 md:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/dang-tin/cho-thue">
            <Button
              size="lg"
              className="bg-primary flex min-w-56 items-center justify-center gap-2.5 rounded-lg px-12 py-8 text-lg font-bold text-white shadow-[0_0_0_4px_rgba(251,170,25,0.25),0_12px_40px_rgba(251,170,25,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_6px_rgba(251,170,25,0.3),0_16px_48px_rgba(251,170,25,0.6)]"
            >
              <PlusCircle size={20} strokeWidth={2.5} />
              Đăng tin cho thuê
            </Button>
          </Link>

          <Link href="/dang-tin/can-thue">
            <Button
              size="lg"
              className="text-body flex min-w-56 items-center justify-center gap-2.5 rounded-lg border-0 bg-white px-12 py-8 text-lg font-bold shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
            >
              <PlusCircle size={20} strokeWidth={2.5} />
              Đăng tin cần thuê
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
