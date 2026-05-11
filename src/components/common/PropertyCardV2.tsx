import { Property } from "@/types/property";
import { Calendar, Camera, Heart, MapPin, Square } from "lucide-react";
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

const getInitials = (name?: string | null) => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
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
  const postedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("vi-VN")
    : "Vừa đăng";
  const userName = property.user?.fullName || "Cao Trang";
  const userPosts = 8;
  const displayAddress = [
    property.ward?.name,
    property.district?.name,
    property.city?.name,
  ]
    .filter(Boolean)
    .join(", ");
  const extraImageCount = Math.max((images?.length || 1) - 5, 0);

  return (
    <article className="group hover:-trangray-y-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
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

        {/* Footer - user info & date */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-xs font-bold">
              {getInitials(userName)}
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-gray-700">
                {userName}
              </div>
              <div className="text-xs text-gray-400">{userPosts} tin đăng</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} />
            <span>{postedDate}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
