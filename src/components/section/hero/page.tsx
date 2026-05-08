import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('/imgs/wallpaper-1.jpg')] bg-cover bg-center">
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
        <div className="mt-10 flex flex-col gap-5 sm:flex-row">
          <Button
            size={"lg"}
            className="bg-primary min-h-14 min-w-48 cursor-pointer rounded-lg px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-px hover:brightness-110"
          >
            Cho thuê
          </Button>
          <Button
            size={"lg"}
            className="bg-primary min-h-14 min-w-48 cursor-pointer rounded-lg px-4 text-sm font-medium tracking-wider text-white uppercase shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-px hover:brightness-110"
          >
            Cần thuê
          </Button>
        </div>
      </div>
    </div>
  );
}
