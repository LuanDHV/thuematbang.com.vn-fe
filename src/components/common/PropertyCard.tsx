"use client";

import Link from "next/link";
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

const DEFAULT_PROPERTY_IMAGE = "/imgs/wallpaper-1.jpg";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl";

type CardTone = PropertyPriority;
type CardDensity = "rich" | "compact";

function resolvePropertyHref(property: Property) {
  return `/cho-thue/${property.slug}`;
}

function getSortedPropertyImageUrls(property: Property) {
  const sortedImages =
    property.images
      ?.slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => image.imageUrl)
      .filter(Boolean) ?? [];

  return sortedImages.filter(
    (url, index, array) => array.indexOf(url) === index,
  );
}

function getPropertyThumbnailUrl(property: Property) {
  return getSortedPropertyImageUrls(property)[0] || DEFAULT_PROPERTY_IMAGE;
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

function getTierLabel(tone: CardTone) {
  switch (tone) {
    case "PREMIUM":
      return "Cao cấp";
    case "STANDARD":
      return "Tiêu chuẩn";
    default:
      return "Miễn phí";
  }
}

function CardFooter({ property }: { property: Property }) {
  return (
    <div className="text-secondary border-hairline mt-auto grid grid-cols-2 gap-2 border-t border-dashed pt-3 text-xs">
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
        ? "bg-surface/92 text-body"
        : "bg-subtle text-secondary";
  const iconSize = 14;

  return (
    <span
      className={`absolute top-3 left-0 z-20 inline-flex items-center gap-1 rounded-l-none rounded-r-full px-2 py-0.5 text-xs font-semibold ${toneClasses}`}
    >
      {tone === "PREMIUM" ? <Crown size={iconSize} /> : null}
      {tone === "STANDARD" ? <Star size={iconSize} /> : null}
      {getTierLabel(tone)}
    </span>
  );
}

function ImageCountBadge({ count, tone }: { count: number; tone: CardTone }) {
  const badgeSizeClass =
    tone === "PREMIUM" ? "px-2 py-0.5 text-sm" : "px-2 py-0.5 text-xs";
  const iconSize = 14;

  return (
    <div
      className={`absolute top-3 right-3 z-30 rounded-lg bg-black/50 font-semibold text-white ${badgeSizeClass}`}
    >
      <span className="inline-flex items-center gap-1">
        <Images size={iconSize} />
        {count}
      </span>
    </div>
  );
}

function CardHoverBar() {
  return (
    <div className="from-primary to-primary/70 h-0.5 w-0 bg-linear-to-r transition-[width] duration-300 group-hover:w-full" />
  );
}

function FeaturedCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const tone = getTierTone(property.priorityStatus);

  return (
    <article className={`surface-editorial ${CARD_HOVER_CLASSES}`}>
      <div className="relative h-52 overflow-hidden">
        <TierBadge tone={tone} />
        <CloudinaryImage
          src={getPropertyThumbnailUrl(property)}
          alt={property.title || "Bất động sản"}
          width={1200}
          height={800}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          cldQuality="auto:good"
        />
      </div>

      <CardBody
        property={property}
        density="rich"
        tone={tone}
        showPreview={false}
        showRooms={false}
      />
      <CardHoverBar />
    </article>
  );
}

function PremiumCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const imagesList = getSortedPropertyImageUrls(property);
  const realImageCount = imagesList.length;
  const heroImage = imagesList[0] || fallbackImage;
  const sideImages = imagesList.slice(1, 4);
  const hasSideGallery = sideImages.length > 0;
  const sideLayout =
    sideImages.length >= 3
      ? "stacked"
      : sideImages.length === 2
        ? "split"
        : sideImages.length === 1
          ? "single"
          : "none";

  return (
    <article
      className={`surface-marketplace ${CARD_HOVER_CLASSES} border-primary/10`}
    >
      <div className="bg-subtle relative flex h-60 w-full gap-0.5 overflow-hidden">
        <div
          className={`relative h-full overflow-hidden ${hasSideGallery ? "w-2/3" : "w-full"}`}
        >
          <CloudinaryImage
            src={heroImage}
            alt={property.title || "Bất động sản"}
            width={1200}
            height={800}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            cldQuality="auto:good"
          />
        </div>

        {hasSideGallery ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            {sideLayout === "single" ? (
              <div className="relative h-full w-full overflow-hidden">
                <CloudinaryImage
                  src={sideImages[0] || fallbackImage}
                  alt={`${property.title} - ảnh 2`}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 40vw, 20vw"
                  className="h-full w-full object-cover"
                  cldQuality="auto:good"
                />
              </div>
            ) : sideLayout === "split" ? (
              <>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[0] || fallbackImage}
                    alt={`${property.title} - ảnh 2`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                  />
                </div>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[1] || fallbackImage}
                    alt={`${property.title} - ảnh 3`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[0] || fallbackImage}
                    alt={`${property.title} - ảnh 2`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 40vw, 20vw"
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                  />
                </div>
                <div className="flex h-1/2 w-full gap-0.5">
                  <div className="relative h-full w-1/2 overflow-hidden">
                    <CloudinaryImage
                      src={sideImages[1] || fallbackImage}
                      alt={`${property.title} - ảnh 3`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 30vw, 15vw"
                      className="h-full w-full object-cover"
                      cldQuality="auto:good"
                    />
                  </div>
                  <div className="relative h-full w-1/2 overflow-hidden">
                    <CloudinaryImage
                      src={sideImages[2] || fallbackImage}
                      alt={`${property.title} - ảnh 4`}
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 30vw, 15vw"
                      className="h-full w-full object-cover"
                      cldQuality="auto:good"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}

        <TierBadge tone="PREMIUM" />
        <ImageCountBadge count={realImageCount} tone="PREMIUM" />
      </div>

      <CardBody
        property={property}
        density="rich"
        tone="PREMIUM"
        showPreview={false}
      />
      <CardHoverBar />
    </article>
  );
}

function StandardCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const fallbackImage = getPropertyThumbnailUrl(property);
  const imagesList = getSortedPropertyImageUrls(property);
  const realImageCount = imagesList.length;
  const heroImage = imagesList[0] || fallbackImage;
  const sideImages = imagesList.slice(1, 3);
  const hasSideGallery = sideImages.length > 0;

  return (
    <article className={`surface-marketplace ${CARD_HOVER_CLASSES}`}>
      <div className="relative flex h-56 w-full gap-0.5 overflow-hidden">
        <div
          className={`relative overflow-hidden ${hasSideGallery ? "w-2/3" : "w-full"}`}
        >
          <CloudinaryImage
            src={heroImage}
            alt={property.title || "Bất động sản"}
            width={1200}
            height={800}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            cldQuality="auto:good"
          />
        </div>

        {hasSideGallery ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            {sideImages.length === 1 ? (
              <div className="relative h-full overflow-hidden">
                <CloudinaryImage
                  src={sideImages[0] || fallbackImage}
                  alt={`${property.title} - ảnh phụ 1`}
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 30vw, 15vw"
                  className="h-full w-full object-cover"
                  cldQuality="auto:good"
                />
              </div>
            ) : (
              sideImages.map((src, index) => (
                <div
                  key={`${property.id}-right-thumb-${index}`}
                  className="relative h-1/2 overflow-hidden"
                >
                  <CloudinaryImage
                    src={src || fallbackImage}
                    alt={`${property.title} - ảnh phụ ${index + 1}`}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 30vw, 15vw"
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                  />
                </div>
              ))
            )}
          </div>
        ) : null}

        <TierBadge tone="STANDARD" />
        <ImageCountBadge count={realImageCount} tone="STANDARD" />
      </div>

      <CardBody
        property={property}
        density="rich"
        tone="STANDARD"
        showPreview={false}
        showRooms
      />
      <CardHoverBar />
    </article>
  );
}

function FreeCard({
  property,
  priority = false,
}: {
  property: Property;
  priority?: boolean;
}) {
  const image = getPropertyThumbnailUrl(property);

  return (
    <article className={`surface-utility ${CARD_HOVER_CLASSES}`}>
      <div className="relative h-40 overflow-hidden">
        <CloudinaryImage
          src={image}
          alt={property.title || "Bất động sản"}
          width={1200}
          height={800}
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          cldQuality="auto:good"
        />
        <TierBadge tone="FREE" />
      </div>

      <CardBody
        property={property}
        density="compact"
        tone="FREE"
        showPreview={false}
        showRooms
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
  showRooms = true,
}: {
  property: Property;
  density: CardDensity;
  tone: CardTone;
  showPreview: boolean;
  showRooms?: boolean;
}) {
  const location = formatLocationParts(
    [property.ward?.name, property.province?.name],
    "Đang cập nhật vị trí",
  );
  const contentPreview = property.content?.replace(/<[^>]+>/g, "").trim() || "";
  const isCompact = density === "compact";
  const bedroomsText = showRooms
    ? property.bedrooms
      ? `${property.bedrooms} phòng ngủ`
      : isCompact
        ? null
        : "Đang cập nhật phòng ngủ"
    : null;
  const bathroomsText = showRooms
    ? property.bathrooms
      ? `${property.bathrooms} phòng tắm`
      : isCompact
        ? null
        : "Đang cập nhật phòng tắm"
    : null;

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
      ? "text-sm"
      : tone === "STANDARD"
        ? "text-xs"
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

  const previewTextClass =
    tone === "PREMIUM"
      ? "text-sm"
      : tone === "STANDARD"
        ? "text-sm"
        : "text-sm";
  const metaGridClass =
    tone === "PREMIUM" || tone === "STANDARD"
      ? "grid-cols-1"
      : isCompact
        ? "grid-cols-1"
        : "grid-cols-2";

  return (
    <div className="flex h-full flex-1 flex-col p-4">
      {property.category?.name && (
        <span
          className={`text-primary mb-2 inline-flex w-fit items-center self-start font-semibold tracking-[0.16em] uppercase ${categoryBadgeSizeClass}`}
        >
          {property.category.name}
        </span>
      )}
      <h3 className="text-heading group-hover:text-primary mb-2 line-clamp-2 text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
        {property.title}
      </h3>

      <p
        className={`group-hover:text-primary text-heading transition-colors duration-200 ${priceClass} font-semibold tracking-[-0.01em]`}
      >
        {formatNegotiablePrice(property.price, property.isNegotiable, {
          fallback: "Liên hệ",
          amount: property.priceAmount,
          unit: property.priceUnit,
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
  priority = false,
}: {
  property: Property;
  variant?: "featured" | "tier";
  priority?: boolean;
}) {
  const href = resolvePropertyHref(property);

  let content: React.ReactNode;

  if (variant === "featured") {
    content = <FeaturedCard property={property} priority={priority} />;
  } else {
    const tier = (property.priorityStatus ?? "FREE") as PropertyPriority;
    switch (tier) {
      case "PREMIUM":
        content = <PremiumCard property={property} priority={priority} />;
        break;
      case "STANDARD":
        content = <StandardCard property={property} priority={priority} />;
        break;
      default:
        content = <FreeCard property={property} priority={priority} />;
        break;
    }
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
