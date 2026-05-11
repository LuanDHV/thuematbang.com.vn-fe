export default function Banner() {
  return (
    <div className="relative flex min-h-175 w-full flex-col bg-[url('/imgs/wallpaper-1.jpg')] bg-cover bg-center">
      {/* Lớp phủ đen - Giữ absolute để phủ toàn bộ background */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Container giới hạn độ rộng 7xl */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 py-12 lg:py-20">
        {/* Nội dung chính */}
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Lorem ipsum dolor sit amet elit.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light text-gray-300 md:text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}
