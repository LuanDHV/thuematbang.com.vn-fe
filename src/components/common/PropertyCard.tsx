import { formatDate, formatPrice } from "@/lib/utils";
import { Property } from "@/types/property";
import {
  Bath,
  Bed,
  Calendar,
  Eye,
  Images,
  MapPin,
  Maximize,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function resolvePropertyHref(property: Property) {
  return property.listingType === "RENT_WANTED"
    ? `/can-thue/${property.slug}`
    : `/cho-thue/${property.slug}`;
}

function getTierLabel(priorityStatus?: string | null) {
  switch (priorityStatus) {
    case "gold":
      return "Gold";
    case "silver":
      return "Silver";
    default:
      return "Normal";
  }
}

function getLocationText(property: Property) {
  return [property.district?.name, property.city?.name]
    .filter(Boolean)
    .join(", ");
}

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-sm text-gray-500">
      <span className="inline-flex items-center gap-1">
        <Calendar size={11} />
        {formatDate(property.createdAt)}
      </span>
      <span className="inline-flex items-center gap-1">
        <Eye size={11} />
        {(property.viewCount || 0).toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

function TierBadge({ label }: { label: string }) {
  return (
    <span className="bg-primary absolute top-3 left-3 z-20 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider text-white uppercase shadow-sm">
      {label}
    </span>
  );
}

function ImageCountBadge({ count }: { count: number }) {
  return (
    <div className="absolute top-3 right-3 z-30 rounded-md bg-black/55 px-2 py-1 text-sm font-semibold text-white">
      <span className="inline-flex items-center gap-1">
        <Images size={13} />
        {count}
      </span>
    </div>
  );
}

function OverlayTitle({
  property,
  large = false,
}: {
  property: Property;
  large?: boolean;
}) {
  return (
    <div className="absolute right-3 bottom-3 left-3 z-20">
      {property.category?.name ? (
        <span className="text-primary rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold uppercase">
          {property.category.name}
        </span>
      ) : null}
      <h3
        className={`mt-2 line-clamp-2 font-bold text-white ${large ? "text-xl leading-tight" : "text-lg leading-tight"}`}
      >
        {property.title}
      </h3>
    </div>
  );
}

function FeaturedCard({ property }: { property: Property }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden">
        <TierBadge label={getTierLabel(property.priorityStatus)} />
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

        <div className="absolute right-3 bottom-3 left-3">
          {property.category?.name ? (
            <span className="text-primary rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase">
              {property.category.name}
            </span>
          ) : null}
          <h3 className="mt-2 line-clamp-2 text-lg leading-tight font-bold text-white">
            {property.title}
          </h3>
        </div>
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}
function GoldCard({
  property,
}: {
  property: Property & { images?: string[] };
}) {
  const fallbackImage = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";
  const imagesList =
    property.images && property.images.length > 0
      ? property.images
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  return (
    <article className="group overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex h-60 w-full gap-0.5 overflow-hidden bg-gray-100">
        <div
          className={`relative h-full overflow-hidden ${imagesList.length > 1 ? "w-2/3" : "w-full"}`}
        >
          <Image
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {imagesList.length > 1 ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            <div className="relative h-1/2 w-full overflow-hidden">
              <Image
                src={imagesList[1] || fallbackImage}
                alt={`${property.title} - ảnh 2`}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="flex h-1/2 w-full gap-0.5">
              <div className="relative h-full w-1/2 overflow-hidden">
                <Image
                  src={imagesList[2] || fallbackImage}
                  alt={`${property.title} - ảnh 3`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-full w-1/2 overflow-hidden">
                <Image
                  src={imagesList[3] || fallbackImage}
                  alt={`${property.title} - ảnh 4`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute top-0 left-0 h-0 w-0 border-t-56 border-r-56 border-t-white/70 border-r-transparent" />
        <TierBadge label="Gold" />
        <ImageCountBadge count={imagesList.length} />
        <OverlayTitle property={property} large />
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function SilverCard({
  property,
}: {
  property: Property & { images?: string[] };
}) {
  const fallbackImage = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";
  const imagesList =
    property.images && property.images.length > 0
      ? property.images
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  const rightThumbs = [
    imagesList[1] || fallbackImage,
    imagesList[2] || fallbackImage,
  ];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-56 w-full gap-0.5 overflow-hidden bg-gray-100">
        <div className="relative w-2/3 overflow-hidden">
          <Image
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex w-1/3 flex-col gap-0.5">
          {rightThumbs.map((src, index) => (
            <div
              key={`${property.id}-right-thumb-${index}`}
              className="relative h-1/2 overflow-hidden"
            >
              <Image
                src={src}
                alt={`${property.title} - ảnh phụ ${index + 1}`}
                fill
                sizes="(max-width: 768px) 30vw, 15vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
        <TierBadge label="Silver" />
        <ImageCountBadge count={imagesList.length} />
        <OverlayTitle property={property} />
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function NormalCard({ property }: { property: Property }) {
  const image = property.thumbnailUrl || "/imgs/wallpaper-1.jpg";

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
        <TierBadge label="Normal" />
        <OverlayTitle property={property} />
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function CardBody({ property }: { property: Property }) {
  const location = getLocationText(property) || "Đang cập nhật vị trí";

  return (
    <div className="flex min-h-55 flex-1 flex-col p-4">
      <p className="text-primary mt-1 text-base font-bold">
        {formatPrice(property.price || 0)}
      </p>

      <div className="my-2 space-y-1 text-sm text-gray-500">
        <p className="flex items-start gap-1">
          <MapPin size={12} className="mt-0.5 text-gray-400" />
          <span className="line-clamp-1">{location}</span>
        </p>
        <p className="flex items-start gap-1">
          <Maximize size={12} className="mt-0.5 text-gray-400" />
          {property.area ? `${property.area} m²` : "Đang cập nhật diện tích"}
        </p>
        {property.bathrooms ? (
          <p className="flex items-start gap-1">
            <Bath size={12} className="mt-0.5 text-gray-400" />
            {property.bathrooms} phòng tắm
          </p>
        ) : null}
        {property.bedrooms ? (
          <p className="flex items-start gap-1">
            <Bed size={12} className="mt-0.5 text-gray-400" />
            {property.bedrooms} phòng ngủ
          </p>
        ) : null}
        {property.description ? (
          <p className="line-clamp-2">{property.description}</p>
        ) : null}
      </div>

      <CardFooter property={property} />
    </div>
  );
}

export function PropertyCard({
  property,
  variant = "tier",
}: {
  property: Property;
  variant?: "featured" | "tier";
}) {
  const href = resolvePropertyHref(property);

  let content: React.ReactNode;

  if (variant === "featured") {
    content = <FeaturedCard property={property} />;
  } else {
    const tier = property.priorityStatus ?? "normal";
    switch (tier) {
      case "gold":
        content = <GoldCard property={property} />;
        break;
      case "silver":
        content = <SilverCard property={property} />;
        break;
      default:
        content = <NormalCard property={property} />;
        break;
    }
  }

  return <Link href={href}>{content}</Link>;
}
