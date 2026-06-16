"use client";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import {
  formatAreaValue,
  formatDate,
  formatLocationParts,
  formatNegotiablePrice,
  formatNumber,
} from "@/lib/format";
import type { PropertyPriority } from "@/types";
import { Property } from "@/types/property";
import {
  Bath,
  Bed,
  Calendar,
  Crown,
  Eye,
  Images,
  MapPin,
  Maximize,
  Star,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_PROPERTY_IMAGE = "/imgs/wallpaper-1.jpg";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(26,18,8,0.13)]";

type CardTone = PropertyPriority;
type CardDensity = "rich" | "compact";

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
  const fallbackImage = images[0] || getPropertyThumbnailUrl(property);
  const normalizedImages = images.length > 0 ? [...images] : [fallbackImage];

  while (normalizedImages.length < 4) {
    normalizedImages.push(fallbackImage);
  }

  return normalizedImages.slice(0, 4);
}

function getTierTone(priorityStatus?: string | null): CardTone {
  switch (priorityStatus) {
    case "PREMIUM":
      return "PREMIUM";
    case "STANDARD":
      return "STANDARD";
    default:
      return "FREE";
  }
}

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="text-secondary mt-auto grid grid-cols-2 gap-2 border-t border-dashed border-black/10 pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(property.createdAt)}
      </span>
      <span className="inline-flex items-center justify-end gap-1">
        <Eye size={14} />
        {formatNumber(property.viewCount, { fallback: "0" })}
      </span>
    </div>
  );
}

function TierBadge({ tone }: { tone: CardTone }) {
  const toneClasses =
    tone === "PREMIUM"
      ? "bg-primary text-white"
      : tone === "STANDARD"
        ? "bg-white/90 text-body"
        : "bg-white/80 text-secondary";
  const iconSize = 14;

  return (
    <span
      className={`absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${toneClasses}`}
    >
      {tone === "PREMIUM" ? <Crown size={iconSize} /> : null}
      {tone === "STANDARD" ? <Star size={iconSize} /> : null}
      {tone}
    </span>
  );
}

function ImageCountBadge({ count, tone }: { count: number; tone: CardTone }) {
  const badgeSizeClass =
    tone === "PREMIUM" ? "px-2 py-0.5 text-sm" : "px-2 py-0.5 text-xs";
  const iconSize = 14;

  return (
    <div
      className={`absolute top-3 right-3 z-30 rounded-lg bg-black/52 font-semibold text-white ${badgeSizeClass}`}
    >
      <span className="inline-flex items-center gap-1">
        <Images size={iconSize} />
        {count}
      </span>
    </div>
  );
}

function OverlayTitle({
  property,
  tone,
}: {
  property: Property;
  tone: CardTone;
}) {
  const titleClass =
    tone === "PREMIUM"
      ? "text-2xl"
      : tone === "STANDARD"
        ? "text-xl "
        : "text-lg";

  return (
    <div className="absolute right-3 bottom-3 left-3 z-20">
      <h3
        className={`line-clamp-2 leading-snug font-medium text-white ${titleClass}`}
      >
        {property.title}
      </h3>
    </div>
  );
}

function CardHoverBar() {
  return (
    <div className="from-primary to-primary/70 h-0.5 w-0 bg-linear-to-r transition-[width] duration-300 group-hover:w-full" />
  );
}

function FeaturedCard({ property }: { property: Property }) {
  const tone = getTierTone(property.priorityStatus);

  return (
    <article className={`surface-card ${CARD_HOVER_CLASSES} rounded-2xl`}>
      <div className="relative h-52 overflow-hidden">
        <TierBadge tone={tone} />
        <CloudinaryImage
          src={getPropertyThumbnailUrl(property)}
          alt={property.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          cldQuality="auto:best"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/62 via-black/18 to-transparent" />
        <OverlayTitle property={property} tone={tone} />
      </div>

      <CardBody
        property={property}
        density="rich"
        tone={tone}
        showPreview={false}
      />
      <CardHoverBar />
    </article>
  );
}

function PremiumCard({ property }: { property: Property }) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const imagesList = getPropertyGalleryImages(property);
  const realImageCount = Math.max(
    1,
    getSortedPropertyImageUrls(property).length,
  );

  return (
    <article
      className={`surface-card ${CARD_HOVER_CLASSES} border-primary/10 rounded-2xl`}
    >
      <div className="bg-subtle relative flex h-60 w-full gap-0.5 overflow-hidden">
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
        <TierBadge tone="PREMIUM" />
        <ImageCountBadge count={realImageCount} tone="PREMIUM" />
        <OverlayTitle property={property} tone="PREMIUM" />
      </div>

      <CardBody property={property} density="rich" tone="PREMIUM" showPreview />
      <CardHoverBar />
    </article>
  );
}

function StandardCard({ property }: { property: Property }) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const imagesList = getPropertyGalleryImages(property);
  const realImageCount = Math.max(
    1,
    getSortedPropertyImageUrls(property).length,
  );

  const rightThumbs = [
    imagesList[1] || fallbackImage,
    imagesList[2] || fallbackImage,
  ];

  return (
    <article className={`surface-card ${CARD_HOVER_CLASSES} rounded-2xl`}>
      <div className="relative flex h-56 w-full gap-0.5 overflow-hidden">
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
        <TierBadge tone="STANDARD" />
        <ImageCountBadge count={realImageCount} tone="STANDARD" />
        <OverlayTitle property={property} tone="STANDARD" />
      </div>

      <CardBody
        property={property}
        density="rich"
        tone="STANDARD"
        showPreview
      />
      <CardHoverBar />
    </article>
  );
}

function FreeCard({ property }: { property: Property }) {
  const image = getPropertyThumbnailUrl(property);

  return (
    <article className={`surface-card ${CARD_HOVER_CLASSES} rounded-xl`}>
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
        <TierBadge tone="FREE" />
        <OverlayTitle property={property} tone="FREE" />
      </div>

      <CardBody
        property={property}
        density="compact"
        tone="FREE"
        showPreview={false}
      />
      <CardHoverBar />
    </article>
  );
}

function CardBody({
  property,
  density,
  tone,
  showPreview,
}: {
  property: Property;
  density: CardDensity;
  tone: CardTone;
  showPreview: boolean;
}) {
  const location = formatLocationParts(
    [property.ward?.name, property.province?.name],
    "Đang cập nhật vị trí",
  );
  const contentPreview = property.content?.replace(/<[^>]+>/g, "").trim() || "";
  const isCompact = density === "compact";
  const bedroomsText = property.bedrooms
    ? `${property.bedrooms} phòng ngủ`
    : isCompact
      ? null
      : "Đang cập nhật phòng ngủ";
  const bathroomsText = property.bathrooms
    ? `${property.bathrooms} phòng tắm`
    : isCompact
      ? null
      : "Đang cập nhật phòng tắm";

  const metaItems = [
    { icon: MapPin, text: location },
    {
      icon: Maximize,
      text: formatAreaValue(property.area, "Đang cập nhật diện tích"),
    },
    bedroomsText ? { icon: Bed, text: bedroomsText } : null,
    bathroomsText ? { icon: Bath, text: bathroomsText } : null,
  ].filter(Boolean) as Array<{ icon: typeof MapPin; text: string }>;

  const categoryBadgeSizeClass =
    tone === "PREMIUM"
      ? "text-base"
      : tone === "STANDARD"
        ? "text-sm"
        : "text-xs";

  const priceClass =
    tone === "PREMIUM"
      ? "text-xl "
      : tone === "STANDARD"
        ? "text-lg "
        : "text-base";

  const metaTextClass =
    tone === "PREMIUM"
      ? "text-sm"
      : tone === "STANDARD"
        ? "text-sm"
        : "text-xs";

  const previewTextClass = tone === "PREMIUM" ? "text-sm" : "text-xs";
  const metaGridClass =
    tone === "PREMIUM" || tone === "STANDARD"
      ? "grid-cols-1"
      : isCompact
        ? "grid-cols-1"
        : "grid-cols-2";

  return (
    <div className="flex h-full flex-1 flex-col p-5">
      {property.category?.name && (
        <span
          className={`text-primary mb-2 inline-flex w-fit items-center self-start font-semibold uppercase ${categoryBadgeSizeClass}`}
        >
          {property.category.name}
        </span>
      )}
      <p
        className={`group-hover:text-primary text-heading transition-colors duration-200 ${priceClass} font-semibold tracking-[-0.01em]`}
      >
        {formatNegotiablePrice(property.price, property.isNegotiable, {
          fallback: "Liên hệ",
        })}
      </p>

      <div
        className={`text-secondary my-2 grid gap-x-4 gap-y-1.5 ${metaGridClass}`}
      >
        {metaItems.map(({ icon: Icon, text }, index) => (
          <p
            key={`${property.id}-meta-${index}`}
            className="flex items-start gap-1.5"
          >
            <Icon size={14} className="text-primary mt-0.5 shrink-0" />
            <span className={`line-clamp-1 ${metaTextClass}`}>{text}</span>
          </p>
        ))}
      </div>

      {showPreview && contentPreview ? (
        <p
          className={`text-secondary mb-2 line-clamp-2 leading-relaxed ${previewTextClass}`}
        >
          {contentPreview}
        </p>
      ) : null}

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
    const tier = (property.priorityStatus ?? "FREE") as PropertyPriority;
    switch (tier) {
      case "PREMIUM":
        content = <PremiumCard property={property} />;
        break;
      case "STANDARD":
        content = <StandardCard property={property} />;
        break;
      default:
        content = <FreeCard property={property} />;
        break;
    }
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

