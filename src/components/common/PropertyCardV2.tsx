import { Property } from "@/types/property";
import { Calendar, Camera, Eye, MapPin, Square } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type PropertyCardV2Props = {
  property: Property;
  images?: string[];
};

const formatPrice = (price: bigint | number) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price)) + "/tháng"
  );
};

const getGalleryImages = (property: Property, images?: string[]) => {
  const baseImage = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";
  const list = (images && images.length > 0 ? images : [baseImage]).slice(0, 5);

  while (list.length < 5) {
    list.push(baseImage);
  }

  return list;
};

function GalleryImage({
  src,
  alt,
  className,
  overlay,
}: {
  src: string;
  alt: string;
  className?: string;
  overlay?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className || ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 42vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {overlay ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-sm font-semibold text-white">
          {overlay}
        </div>
      ) : null}
    </div>
  );
}

export default function PropertyCardV2({
  property,
  images,
}: PropertyCardV2Props) {
  const galleryImages = getGalleryImages(property, images);

  const displayAddress = [
    property.ward?.name,
    property.district?.name,
    property.city?.name,
  ]
    .filter(Boolean)
    .join(", ");

  const extraImageCount = Math.max((images?.length || 1) - 5, 0);

  // Định dạng ngày tháng ngay tại đây
  const dateStr = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("vi-VN")
    : "Vừa đăng";

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
      <div className="p-0.5">
        <div className="grid gap-0.5 lg:grid-cols-[1.55fr_1fr]">
          <div className="relative h-56 overflow-hidden lg:h-84">
            <GalleryImage
              src={galleryImages[0]}
              alt={property.title}
              className="h-full w-full rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none"
            />

            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              {/* Badge hiển thị dựa trên priorityStatus */}
              {property.priorityStatus !== "normal" && (
                <div
                  className={
                    "bg-primary absolute top-3 left-3 rounded px-2.5 py-1 text-[10px] font-bold text-white uppercase shadow-sm transition-all"
                  }
                >
                  {property.priorityStatus}
                </div>
              )}
            </div>
          </div>

          <div className="grid h-56 grid-cols-2 grid-rows-2 gap-0.5 lg:h-84">
            <div className="relative overflow-hidden">
              <GalleryImage
                src={galleryImages[1]}
                alt={property.title}
                className="h-full w-full lg:rounded-tr-2xl"
              />
            </div>
            <div className="relative overflow-hidden">
              <GalleryImage
                src={galleryImages[2]}
                alt={property.title}
                className="h-full w-full"
              />
            </div>
            <div className="relative overflow-hidden">
              <GalleryImage
                src={galleryImages[3]}
                alt={property.title}
                className="h-full w-full"
              />
            </div>
            <div className="relative overflow-hidden">
              <GalleryImage
                src={galleryImages[4]}
                alt={property.title}
                className="h-full w-full lg:rounded-br-2xl"
                overlay={
                  extraImageCount > 0 ? <span>+{extraImageCount}</span> : null
                }
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <Camera size={12} />
                <span>{Math.max(images?.length || 1, 1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 sm:px-5 sm:pb-5">
        {/* 1. Name */}
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="group-hover:text-primary line-clamp-2 min-h-10 text-lg leading-snug font-bold text-gray-800 transition-colors">
            {property.title}
          </h3>
        </div>

        {/* 2. Price */}
        <div className="text-primary mb-3 text-[18px] font-bold sm:text-[20px]">
          {formatPrice(property.price || 0)}
        </div>

        {/* 3. Location */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin size={16} className="shrink-0 text-gray-400" />
          <span className="line-clamp-1">
            {displayAddress || "Đang cập nhật địa chỉ"}
          </span>
        </div>

        {/* 4. Area */}
        <div className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
          <Square size={16} className="shrink-0 text-gray-400" />
          <span className="line-clamp-1">
            {property.area ? `${property.area} m²` : "Đang cập nhật"}
          </span>
        </div>

        {/* 5. Description */}
        <div className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
          {property.description || "Thông tin đang được cập nhật."}
        </div>

        {/* Footer Stats - Ngăn cách rõ ràng bằng border và khoảng trống */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar size={13} strokeWidth={2.5} />
            <span>{dateStr}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-0.5 text-xs">
            <Eye size={13} strokeWidth={2.5} />
            <span>{property.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
