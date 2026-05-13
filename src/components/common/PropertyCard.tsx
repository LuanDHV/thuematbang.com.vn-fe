import { formatDate, formatPrice } from "@/lib/utils";
import { Property } from "@/types/property";
import {
  MapPin,
  Eye,
  Maximize,
  Calendar,
  Bed,
  Images,
  Bath,
} from "lucide-react";
import Image from "next/image";

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] text-gray-400">
      <span className="flex items-center gap-1">
        <Calendar size={11} strokeWidth={2} />
        {formatDate(property.createdAt)}
      </span>
      <span className="flex items-center gap-1">
        <Eye size={11} strokeWidth={2} />
        {(property.viewCount || 0).toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

function FeaturedCard({
  property,
  isFeatured,
}: {
  property: Property;
  isFeatured?: boolean;
}) {
  return (
    <div className="group border-primary/30 border-l-primary cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-48 shrink-0 overflow-hidden">
        <span className="bg-primary/95 absolute top-2 left-2 z-10 rounded-full px-2 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          Gold
        </span>
        {/* {isFeatured ? (
          <span className="bg-primary absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-white" />
            Đẩy tin
          </span>
        ) : null} */}
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-2 min-h-10 text-sm leading-snug font-semibold text-gray-800">
          {property.category?.name && `${property.category.name} — `}
          {property.title}
        </h3>

        <p className="text-primary mb-3 text-base font-semibold">
          {formatPrice(property.price || 0)}
        </p>

        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={12} className="shrink-0" />
            {property.area} m²
          </span>
        </div>

        <CardFooter property={property} />
      </div>
    </div>
  );
}

function GoldCard({
  property,
  isFeatured,
}: {
  property: Property & { images?: string[] };
  isFeatured?: boolean;
}) {
  const fallbackImage = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";

  const imagesList =
    property.images && property.images.length > 0
      ? property.images
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  const totalPhotos = imagesList.length;

  return (
    <div className="group border-primary/30 border-l-primary cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* KHU VỰC THƯ VIỆN ẢNH */}
      <div className="relative flex h-60 w-full shrink-0 gap-0.5 overflow-hidden bg-gray-100">
        <span className="bg-primary/95 absolute top-0 left-0 z-20 rounded-br-xl px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
          gold
        </span>

        {/* Ảnh chính (Trái - Chiếm 2/3) */}
        <div
          className={`relative h-full overflow-hidden ${
            totalPhotos > 1 ? "w-2/3" : "w-full"
          }`}
        >
          <Image
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Ảnh phụ (Phải - Chiếm 1/3) */}
        {totalPhotos > 1 && (
          <div className="flex w-1/3 flex-col gap-0.5">
            {/* Ảnh phụ trên (1 ảnh) */}
            <div className="relative h-1/2 w-full overflow-hidden">
              <Image
                src={imagesList[1] || fallbackImage}
                alt={`${property.title} - Ảnh 2`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw" // Đã tăng sizes để chống mờ
                className="object-cover"
              />
            </div>

            {/* Ảnh phụ dưới (Chia làm 2 ảnh) */}
            <div className="flex h-1/2 w-full gap-0.5">
              {/* Ảnh dưới bên TRÁI */}
              <div className="relative h-full w-1/2 overflow-hidden bg-gray-200">
                <Image
                  src={imagesList[2] || fallbackImage}
                  alt={`${property.title} - Ảnh 3`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw" // Đã tăng sizes để chống mờ
                  className="object-cover"
                />
              </div>

              {/* Ảnh dưới bên PHẢI */}
              <div className="relative h-full w-1/2 overflow-hidden bg-gray-200">
                <Image
                  src={imagesList[3] || fallbackImage}
                  alt={`${property.title} - Ảnh 4`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw" // Đã tăng sizes để chống mờ
                  className="object-cover"
                />

                {/* Lớp phủ mờ + Icon đếm tổng số ảnh */}
                {totalPhotos > 3 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/60">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white drop-shadow-md">
                      {totalPhotos} <Images size={16} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Badge đếm ảnh nổi */}
        {totalPhotos > 0 && totalPhotos <= 3 && (
          <div className="absolute right-2 bottom-2 z-20 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
            <Images size={14} />
            {totalPhotos}
          </div>
        )}
      </div>

      {/* KHU VỰC NỘI DUNG */}
      <div className="flex flex-1 flex-col p-4">
        {property.category?.name && (
          <div className="mb-2 flex">
            <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2 py-0.5 text-xs font-bold tracking-wide uppercase">
              {property.category.name}
            </span>
          </div>
        )}

        <h3 className="group-hover:text-primary mb-1 line-clamp-2 min-h-[2.4rem] text-lg leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.title}
        </h3>

        <p className="text-primary mb-2 text-base font-semibold">
          {formatPrice(property.price || 0)}
        </p>

        <div className="flex flex-col gap-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={12} className="shrink-0" />
            {property.area} m²
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed size={12} className="shrink-0" />
              {property.bedrooms} phòng ngủ
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={12} className="shrink-0" />
              {property.bathrooms} phòng tắm, vệ sinh
            </span>
          )}
          {property.description && (
            <span className="line-clamp-1 flex items-center gap-1">
              {property.description}
            </span>
          )}
        </div>
        <CardFooter property={property} />
      </div>
    </div>
  );
}

function SilverCard({
  property,
  isFeatured,
}: {
  property: Property & { images?: string[] };
  isFeatured?: boolean;
}) {
  // Lấy ảnh gốc hoặc ảnh mặc định
  const fallbackImage = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";

  // MOCK DATA: Nhân bản ảnh lên 4 lần nếu chưa có data (1 trên, 3 dưới)
  const imagesList =
    property.images && property.images.length > 0
      ? property.images
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  const totalPhotos = imagesList.length;

  return (
    <div className="group border-primary/30 border-l-primary cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* KHU VỰC THƯ VIỆN ẢNH */}
      <div className="relative flex h-48 w-full shrink-0 flex-col gap-0.5 overflow-hidden bg-gray-100">
        {/* Nhãn Silver bo góc sát mép */}
        <span className="bg-primary absolute top-0 left-0 z-20 rounded-br-xl px-2 py-1 text-[9px] font-bold tracking-wider text-white uppercase shadow-sm">
          silver
        </span>

        {/* Ảnh chính (Hàng trên - Chiếm 70% chiều cao) */}
        <div
          className={`relative w-full overflow-hidden ${
            totalPhotos > 1 ? "h-[60%]" : "h-full"
          }`}
        >
          <Image
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Ảnh phụ (Hàng dưới - Chiếm 30% chiều cao, chia 3 ảnh) */}
        {totalPhotos > 1 && (
          <div className="flex h-[40%] w-full gap-0.5">
            {/* Ảnh phụ 1 */}
            <div className="relative h-full w-1/3 overflow-hidden bg-gray-200">
              <Image
                src={imagesList[1] || fallbackImage}
                alt={`${property.title} - Ảnh 2`}
                fill
                sizes="(max-width: 768px) 33vw, 11vw"
                className="object-cover"
              />
            </div>

            {/* Ảnh phụ 2 */}
            <div className="relative h-full w-1/3 overflow-hidden bg-gray-200">
              <Image
                src={imagesList[2] || fallbackImage}
                alt={`${property.title} - Ảnh 3`}
                fill
                sizes="(max-width: 768px) 33vw, 11vw"
                className="object-cover"
              />
            </div>

            {/* Ảnh phụ 3 */}
            <div className="relative h-full w-1/3 overflow-hidden bg-gray-200">
              <Image
                src={imagesList[3] || fallbackImage}
                alt={`${property.title} - Ảnh 4`}
                fill
                sizes="(max-width: 768px) 33vw, 11vw"
                className="object-cover"
              />

              {/* Lớp phủ mờ + Icon đếm tổng số ảnh (Chỉ hiện khi có hơn 4 ảnh) */}
              {totalPhotos > 4 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/60">
                  <span className="flex items-center gap-1 text-xs font-semibold text-white drop-shadow-md">
                    {totalPhotos} <Images size={14} />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Badge đếm ảnh nổi (Nếu số lượng <= 4, hiện nhỏ ở góc phải) */}
        {totalPhotos > 0 && totalPhotos <= 4 && (
          <div className="absolute right-1 bottom-1 z-20 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm">
            <Images size={12} />
            {totalPhotos}
          </div>
        )}
      </div>

      {/* KHU VỰC NỘI DUNG (Giữ nguyên của bạn) */}
      <div className="flex flex-1 flex-col p-3">
        {property.category?.name && (
          <div className="mb-1 flex">
            <span className="bg-primary/10 text-primary border-primary/20 rounded border px-1 py-0.5 text-[9px] font-bold tracking-wide uppercase">
              {property.category.name}
            </span>
          </div>
        )}

        <h3 className="group-hover:text-primary mb-1 line-clamp-2 min-h-8 text-sm leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.title}
        </h3>

        <p className="text-primary text-sx mb-2 font-semibold">
          {formatPrice(property.price || 0)}
        </p>

        <div className="flex flex-col gap-0.5 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin size={10} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={10} className="shrink-0" />
            {property.area} m²
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <Calendar size={10} strokeWidth={2} />
            {formatDate(property.createdAt)}
          </span>
          <span className="flex items-center gap-0.5">
            <Eye size={10} strokeWidth={2} />
            {property.viewCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function NormalCard({
  property,
  isFeatured,
}: {
  property: Property;
  isFeatured?: boolean;
}) {
  return (
    <div className="group border-primary/30 border-l-primary cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-32 shrink-0 overflow-hidden">
        {/* Nhãn Normal bo góc sát mép */}
        <span className="bg-primary/80 absolute top-0 left-0 z-10 rounded-br-lg px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase">
          normal
        </span>
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        {/* Nhãn Danh Mục nhỏ gọn cho Normal */}
        {property.category?.name && (
          <div className="mb-1 flex">
            <span className="text-primary bg-primary/10 border-primary/20 rounded border px-1 py-0.5 text-[9px] font-bold tracking-tight uppercase">
              {property.category.name}
            </span>
          </div>
        )}

        <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-xs leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.title}
        </h3>
        <p className="text-primary mb-1 text-xs font-semibold">
          {formatPrice(property.price || 0)}
        </p>
        <span className="flex items-center gap-1 text-[10px] text-gray-500">
          <MapPin size={10} className="shrink-0" />
          {property.district?.name}
        </span>
      </div>
    </div>
  );
}

export function PropertyCard({
  property,
  isFeatured,
  variant = "tier",
}: {
  property: Property;
  isFeatured?: boolean;
  /** "featured" = homepage uniform, "tier" = listing layout theo cấp bậc */
  variant?: "featured" | "tier";
}) {
  if (variant === "featured") {
    return <FeaturedCard property={property} isFeatured={isFeatured} />;
  }

  const tier = property.priorityStatus ?? "normal";
  switch (tier) {
    case "gold":
      return <GoldCard property={property} isFeatured={isFeatured} />;
    case "silver":
      return <SilverCard property={property} isFeatured={isFeatured} />;
    default:
      return <NormalCard property={property} isFeatured={isFeatured} />;
  }
}
