import { formatDate, formatPrice } from "@/lib/utils";
import { Property } from "@/types/property";
import { MapPin, Eye, Square, Calendar, Bed } from "lucide-react";
import Image from "next/image";

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] text-gray-400">
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
        <span className="bg-primary/95 absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          diamond
        </span>
        {/* {isFeatured ? (
          <span className="bg-primary absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
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
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Square size={11} className="shrink-0" />
            {property.area} m²
          </span>
        </div>

        <CardFooter property={property} />
      </div>
    </div>
  );
}

function DiamondCard({
  property,
  isFeatured,
}: {
  property: Property;
  isFeatured?: boolean;
}) {
  return (
    <div className="group border-primary/30 border-l-primary cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-60 shrink-0 overflow-hidden">
        <span className="bg-primary/95 absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          diamond
        </span>
        {/* {isFeatured ? (
          <span className="bg-primary absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Đẩy tin
          </span>
        ) : null} */}
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="group-hover:text-primary mb-1 line-clamp-2 min-h-[2.4rem] text-lg leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.category?.name && `${property.category.name} — `}
          {property.title}
        </h3>
        <p className="text-primary mb-2.5 text-base font-semibold">
          {formatPrice(property.price || 0)}
        </p>
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Square size={11} className="shrink-0" />
            {property.area} m²
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1.5">
              <Bed size={12} className="shrink-0" />
              {property.bedrooms} phòng ngủ
            </span>
          )}
          {property.description && (
            <span className="flex items-center gap-1.5">
              {property.description}
            </span>
          )}
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
  property: Property;
  isFeatured?: boolean;
}) {
  return (
    <div className="group border-primary/35 border-l-primary flex min-h-40 cursor-pointer overflow-hidden rounded-xl border border-l-3 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* 1. Phần Ảnh: chiếm 40% (2/5) */}
      <div className="relative w-[40%] shrink-0 overflow-hidden">
        <span className="bg-primary/95 absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          gold
        </span>
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="40vw" // Tối ưu việc tải ảnh theo độ rộng khung hình
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* 2. Phần Nội dung: chiếm 60% (3/5) */}
      <div className="flex w-[60%] flex-col px-5 py-4">
        <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-base leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.category?.name && `${property.category.name} — `}
          {property.title}
        </h3>

        <p className="text-primary mb-3 text-sm font-semibold">
          {formatPrice(property.price || 0)}
        </p>

        <div className="mb-2 flex flex-col gap-x-4 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="shrink-0" />
            {property.district?.name}, {property.city?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Square size={11} className="shrink-0" />
            {property.area} m²
          </span>
          {property.bedrooms && (
            <span className="flex items-center gap-1.5">
              <Bed size={12} className="shrink-0" />
              {property.bedrooms} phòng ngủ
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
  property: Property;
  isFeatured?: boolean;
}) {
  return (
    <div className="group border-primary/25 flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 shrink-0 overflow-hidden">
        <span className="bg-primary/95 absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          silver
        </span>
        {/* {isFeatured ? (
          <span className="bg-primary absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Đẩy tin
          </span>
        ) : null} */}
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
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
            <Square size={10} className="shrink-0" />
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
    <div className="group border-primary/20 flex cursor-pointer flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative h-32 shrink-0 overflow-hidden">
        <span className="bg-primary/95 absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white uppercase">
          normal
        </span>
        {/* {isFeatured ? (
          <span className="bg-primary absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Đẩy tin
          </span>
        ) : null} */}
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="group-hover:text-primary mb-1 line-clamp-2 text-xs leading-snug font-semibold text-gray-800 transition-colors duration-300 ease-in-out">
          {property.title}
        </h3>
        <p className="text-primary mb-1.5 text-xs font-semibold">
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
    case "diamond":
      return <DiamondCard property={property} isFeatured={isFeatured} />;
    case "gold":
      return <GoldCard property={property} isFeatured={isFeatured} />;
    case "silver":
      return <SilverCard property={property} isFeatured={isFeatured} />;
    default:
      return <NormalCard property={property} isFeatured={isFeatured} />;
  }
}
