"use client";
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
import CloudinaryImage from "@/components/common/CloudinaryImage";
import Link from "next/link";

const DEFAULT_PROPERTY_IMAGE = "/imgs/wallpaper-1.jpg";

function resolvePropertyHref(property: Property) {
  return `/cho-thue/${property.slug}`;
}

function getSortedPropertyImageUrls(property: Property) {
  return (
    property.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? []
  );
}

function getPropertyThumbnailUrl(property: Property) {
  return getSortedPropertyImageUrls(property)[0] || DEFAULT_PROPERTY_IMAGE;
}

function getPropertyGalleryImages(property: Property) {
  const images = getSortedPropertyImageUrls(property);
  if (images.length > 0) return images;

  const fallbackImage = getPropertyThumbnailUrl(property);
  return [fallbackImage, fallbackImage, fallbackImage, fallbackImage];
}

function getTierLabel(priorityStatus?: string | null) {
  switch (priorityStatus) {
    case "GOLD":
      return "Gold";
    case "SILVER":
      return "Silver";
    default:
      return "Normal";
  }
}

function getLocationText(property: Property) {
  return [property.ward?.name, property.province?.name]
    .filter(Boolean)
    .join(", ");
}

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="text-muted mt-auto flex items-center justify-between border-t border-dashed border-black/8 pt-3 text-sm">
      <span className="font-mono inline-flex items-center gap-1">
        <Calendar size={11} />
        {formatDate(property.createdAt)}
      </span>
      <span className="font-mono inline-flex items-center gap-1">
        <Eye size={11} />
        {(property.viewCount || 0).toLocaleString("vi-VN")}
      </span>
    </div>
  );
}

function TierBadge({ label }: { label: string }) {
  return (
    <span className="text-primary absolute top-3 left-3 z-20 rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      {label}
    </span>
  );
}

function ImageCountBadge({ count }: { count: number }) {
  return (
    <div className="absolute top-3 right-3 z-30 rounded-lg bg-black/52 px-2.5 py-1 text-sm font-semibold text-white">
      <span className="font-mono inline-flex items-center gap-1">
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
        <span className="text-primary rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-semibold uppercase">
          {property.category.name}
        </span>
      ) : null}
      <h3
        className={`mt-2 line-clamp-2 font-semibold tracking-[-0.02em] text-white ${large ? "text-xl leading-tight" : "text-lg leading-tight"}`}
      >
        {property.title}
      </h3>
    </div>
  );
}

function FeaturedCard({ property }: { property: Property }) {
  return (
    <article className="surface-card interactive-lift group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative h-52 overflow-hidden">
        <TierBadge label={getTierLabel(property.priorityStatus)} />
        <CloudinaryImage
          src={getPropertyThumbnailUrl(property)}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          cldQuality="auto:best"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/62 via-black/18 to-transparent" />

        <div className="absolute right-3 bottom-3 left-3">
          {property.category?.name ? (
            <span className="text-primary rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase">
              {property.category.name}
            </span>
          ) : null}
          <h3 className="mt-2 line-clamp-2 text-lg leading-tight font-semibold tracking-[-0.02em] text-white">
            {property.title}
          </h3>
        </div>
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function GoldCard({ property }: { property: Property }) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const galleryImages = getPropertyGalleryImages(property);
  const imagesList =
    galleryImages.length > 0
      ? galleryImages
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  return (
    <article className="surface-card interactive-lift group border-primary/12 flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative flex h-60 w-full gap-0.5 overflow-hidden bg-gray-100">
        <div
          className={`relative h-full overflow-hidden ${imagesList.length > 1 ? "w-2/3" : "w-full"}`}
        >
          <CloudinaryImage
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            cldQuality="auto:best"
          />
        </div>

        {imagesList.length > 1 ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            <div className="relative h-1/2 w-full overflow-hidden">
              <CloudinaryImage
                src={imagesList[1] || fallbackImage}
                alt={`${property.title} - ảnh 2`}
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                className="object-cover"
                cldQuality="auto:best"
              />
            </div>
            <div className="flex h-1/2 w-full gap-0.5">
              <div className="relative h-full w-1/2 overflow-hidden">
                <CloudinaryImage
                  src={imagesList[2] || fallbackImage}
                  alt={`${property.title} - ảnh 3`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                  cldQuality="auto:best"
                />
              </div>
              <div className="relative h-full w-1/2 overflow-hidden">
                <CloudinaryImage
                  src={imagesList[3] || fallbackImage}
                  alt={`${property.title} - ảnh 4`}
                  fill
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="object-cover"
                  cldQuality="auto:best"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/24 to-transparent" />
        <TierBadge label="Gold" />
        <ImageCountBadge count={imagesList.length} />
        <OverlayTitle property={property} large />
      </div>

      <CardBody property={property} />
      <div className="bg-primary h-1 w-0 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function SilverCard({ property }: { property: Property }) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const galleryImages = getPropertyGalleryImages(property);
  const imagesList =
    galleryImages.length > 0
      ? galleryImages
      : [fallbackImage, fallbackImage, fallbackImage, fallbackImage];

  const rightThumbs = [
    imagesList[1] || fallbackImage,
    imagesList[2] || fallbackImage,
  ];

  return (
    <article className="surface-card interactive-lift group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative flex h-56 w-full gap-0.5 overflow-hidden bg-gray-100">
        <div className="relative w-2/3 overflow-hidden">
          <CloudinaryImage
            src={imagesList[0]}
            alt={property.title || "Bất động sản"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            cldQuality="auto:best"
          />
        </div>

        <div className="flex w-1/3 flex-col gap-0.5">
          {rightThumbs.map((src, index) => (
            <div
              key={`${property.id}-right-thumb-${index}`}
              className="relative h-1/2 overflow-hidden"
            >
              <CloudinaryImage
                src={src}
                alt={`${property.title} - ảnh phụ ${index + 1}`}
                fill
                sizes="(max-width: 768px) 30vw, 15vw"
                className="object-cover"
                cldQuality="auto:best"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/24 to-transparent" />
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
  const image = getPropertyThumbnailUrl(property);

  return (
    <article className="surface-card interactive-lift group flex h-full flex-col overflow-hidden rounded-xl">
      <div className="relative h-40 overflow-hidden">
        <CloudinaryImage
          src={image}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          cldQuality="auto:best"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/72 via-black/22 to-transparent" />
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
  const contentPreview = property.content?.replace(/<[^>]+>/g, "").trim() || "";

  return (
    <div className="flex h-full flex-1 flex-col p-5">
      <p className="text-heading text-base font-semibold transition-colors duration-200 group-hover:text-primary md:text-lg">
        {formatPrice(property.price || 0)}
      </p>

      <div className="text-muted my-2 flex flex-col gap-1 text-sm">
        <p className="flex items-start gap-1">
          <MapPin size={12} className="text-primary/70 mt-0.5" />
          <span className="font-mono line-clamp-1">{location}</span>
        </p>
        <p className="flex items-start gap-1">
          <Maximize size={12} className="text-primary/70 mt-0.5" />
          <span className="font-mono">
            {property.area ? `${property.area} m²` : "Đang cập nhật diện tích"}
          </span>
        </p>
        {property.bathrooms ? (
          <p className="flex items-start gap-1">
            <Bath size={12} className="text-primary/70 mt-0.5" />
            <span className="font-mono">{property.bathrooms} phòng tắm</span>
          </p>
        ) : null}
        {property.bedrooms ? (
          <p className="flex items-start gap-1">
            <Bed size={12} className="text-primary/70 mt-0.5" />
            <span className="font-mono">{property.bedrooms} phòng ngủ</span>
          </p>
        ) : null}
        {contentPreview ? (
          <p className="line-clamp-2">{contentPreview}</p>
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
    const tier = property.priorityStatus ?? "NORMAL";
    switch (tier) {
      case "GOLD":
        content = <GoldCard property={property} />;
        break;
      case "SILVER":
        content = <SilverCard property={property} />;
        break;
      default:
        content = <NormalCard property={property} />;
        break;
    }
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
