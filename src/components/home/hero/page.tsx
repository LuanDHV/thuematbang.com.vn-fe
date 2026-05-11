import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-175 w-full items-center justify-center bg-[url('/imgs/wallpaper-1.jpg')] bg-cover bg-center">
      {/* Lớp phủ đen sang trọng (độ mờ 60% để nổi bật text) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Dòng text chính - Font Bold, Tracking tight để trông hiện đại */}
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
          Lorem ipsum dolor sit amet elit.
        </h1>
        {/* Dòng text phụ - Màu xám nhẹ, font nhẹ nhàng */}
        <p className="mt-6 max-w-2xl text-lg font-light text-gray-300 md:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* 2 Navigate Buttons */}
        <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:gap-8">
          {/* Nút 1: Solid với Gradient & Icon */}
          <Link href="cho-thue" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 bg-primary hover:bg-primary hover:border-primary group hover:-trangray-y-1 min-h-16 w-full min-w-55 cursor-pointer rounded-full border-2 px-10 text-lg font-bold tracking-widest text-white uppercase backdrop-blur-md transition-all duration-300 hover:text-white hover:shadow-[0_25px_50px_-12px_rgba(251,170,25,0.5)] lg:min-h-21 lg:min-w-75 lg:text-xl"
            >
              <Search className="mr-2 h-5 w-5 text-white transition-colors" />
              <span>Cho thuê</span>
            </Button>
          </Link>

          {/* Nút 2: Outline phối hợp Subtle Glassmorphism */}
          <Link href="can-thue" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 hover:bg-primary hover:border-primary group text-primary hover:-trangray-y-1 min-h-16 w-full min-w-55 cursor-pointer rounded-full border-2 bg-white px-10 text-lg font-bold tracking-widest uppercase backdrop-blur-md transition-all duration-300 hover:text-white hover:shadow-[0_25px_50px_-12px_rgba(251,170,25,0.5)] lg:min-h-21 lg:min-w-75 lg:text-xl"
            >
              <Search className="text-primary mr-2 h-5 w-5 transition-colors group-hover:text-white" />
              <span>Cần thuê</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
