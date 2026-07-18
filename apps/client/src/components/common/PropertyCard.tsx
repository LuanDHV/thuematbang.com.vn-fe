"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Bath,
  Bed,
  Calendar,
  Crown,
  Eye,
  Gem,
  Images,
  Heart,
  MapPin,
  Maximize,
} from "lucide-react";

import CloudinaryImage from "@/components/common/CloudinaryImage";
import FavoriteButton from "@/components/common/FavoriteButton";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import {
  formatAreaValue,
  formatDate,
  formatLocationParts,
  formatNegotiablePrice,
  formatNumber,
} from "@/lib/format";
import type { PropertyPriority } from "@/types";
import { Property } from "@/types/property";

const DEFAULT_PROPERTY_IMAGE = "/imgs/fallback.png";
const CARD_HOVER_CLASSES =
  "group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-2xl";
const FEATURED_CARD_IMAGE_SIZES =
  "(max-width: 767px) 92vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw";
const TIER_MAIN_IMAGE_SIZES =
  "(max-width: 767px) 92vw, (max-width: 1023px) 50vw, 33vw";
const TIER_SIDE_IMAGE_SIZES =
  "(max-width: 767px) 30vw, (max-width: 1023px) 20vw, 15vw";
const TIER_SIDE_SMALL_IMAGE_SIZES =
  "(max-width: 767px) 24vw, (max-width: 1023px) 15vw, 12vw";
const FREE_CARD_IMAGE_SIZES =
  "(max-width: 767px) 92vw, (max-width: 1023px) 33vw, 25vw";
const LUCKY_CARD_IMAGE_SIZES =
  "(max-width: 767px) 92vw, (max-width: 1023px) 50vw, 25vw";

type CardTone = PropertyPriority;
type CardDensity = "rich" | "compact";

function resolvePropertyHref(property: Property) {
  return `/cho-thue/${property?.slug}`;
}

function getSortedPropertyImageUrls(property: Property) {
  const sortedImages =
    property?.images
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

function CardFooter({
  property,
  favoriteCount,
}: {
  property: Property;
  favoriteCount: number;
}) {
  return (
    <div className="text-secondary border-hairline mt-auto flex items-center justify-between gap-2 border-t border-dashed pt-3 text-xs">
      <span className="inline-flex items-center gap-1">
        <Calendar size={14} />
        {formatDate(property?.createdAt)}
      </span>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="inline-flex items-center gap-1">
          <Heart size={14} />
          {formatNumber(favoriteCount, { fallback: "0" })}
        </span>
        <span>|</span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {formatNumber(property?.viewCount, { fallback: "0" })}
        </span>
      </span>
    </div>
  );
}

function TierBadge({ tone }: { tone: CardTone }) {
  const toneClasses =
    tone === "PREMIUM"
      ? "bg-primary text-white"
      : tone === "STANDARD"
        ? "bg-accent-soft text-primary"
        : "bg-surface text-body border border-hairline";
  const iconSize = 14;

  return (
    <span
      className={`absolute top-3 left-3 z-20 inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold shadow-sm ${toneClasses}`}
    >
      {tone === "PREMIUM" ? <Gem size={iconSize} /> : null}
      {tone === "STANDARD" ? <Crown size={iconSize} /> : null}
      {getTierLabel(tone)}
    </span>
  );
}

function ImageCountBadge({ count }: { count: number }) {
  return (
    <div className="absolute top-14 right-3 z-30 inline-flex h-7 min-w-10 items-center justify-center gap-1 rounded-lg bg-slate-900 px-2 text-[11px] font-semibold text-white shadow-sm">
      <Images size={14} />
      {count}
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
  favoriteCount,
  priority = false,
}: {
  property: Property;
  favoriteCount: number;
  priority?: boolean;
}) {
  const tone = getTierTone(property?.priorityStatus);
  const realImageCount = getSortedPropertyImageUrls(property).length;

  return (
    <article className={`surface-editorial ${CARD_HOVER_CLASSES}`}>
      <div className="relative h-52 overflow-hidden">
        <TierBadge tone={tone} />
        <ImageCountBadge count={realImageCount} />
        <CloudinaryImage
          src={getPropertyThumbnailUrl(property)}
          alt={property?.title || "Bất động sản"}
          width={1200}
          height={800}
          priority={priority}
          sizes={FEATURED_CARD_IMAGE_SIZES}
          className="h-full w-full object-cover"
          cldQuality="auto:good"
          fallbackSrc={DEFAULT_PROPERTY_IMAGE}
        />
      </div>

      <CardBody
        property={property}
        favoriteCount={favoriteCount}
        density="rich"
        tone={tone}
        showRooms={false}
      />
      <CardHoverBar />
    </article>
  );
}

function LuckyCard({
  property,
  favoriteCount,
  priority = false,
}: {
  property: Property;
  favoriteCount: number;
  priority?: boolean;
}) {
  const tone = getTierTone(property?.priorityStatus);
  const realImageCount = getSortedPropertyImageUrls(property).length;

  return (
    <article className={`surface-utility ${CARD_HOVER_CLASSES}`}>
      <div className="relative h-48 overflow-hidden">
        <TierBadge tone={tone} />
        <ImageCountBadge count={realImageCount} />
        <CloudinaryImage
          src={getPropertyThumbnailUrl(property)}
          alt={property?.title || "Bất động sản"}
          width={1200}
          height={800}
          priority={priority}
          sizes={LUCKY_CARD_IMAGE_SIZES}
          className="h-full w-full object-cover"
          cldQuality="auto:good"
          fallbackSrc={DEFAULT_PROPERTY_IMAGE}
        />
      </div>

      <CardBody
        property={property}
        favoriteCount={favoriteCount}
        density="compact"
        tone={tone}
        showRooms
      />
      <CardHoverBar />
    </article>
  );
}

function PremiumCard({
  property,
  favoriteCount,
  priority = false,
}: {
  property: Property;
  favoriteCount: number;
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
            alt={property?.title || "Bất động sản"}
            width={1200}
            height={800}
            priority={priority}
            sizes={TIER_MAIN_IMAGE_SIZES}
            className="h-full w-full object-cover"
            cldQuality="auto:good"
            fallbackSrc={DEFAULT_PROPERTY_IMAGE}
          />
        </div>

        {hasSideGallery ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            {sideLayout === "single" ? (
              <div className="relative h-full w-full overflow-hidden">
                <CloudinaryImage
                  src={sideImages[0] || fallbackImage}
                  alt={`${property?.title} - ảnh 2`}
                  width={800}
                  height={600}
                  sizes={TIER_SIDE_IMAGE_SIZES}
                  className="h-full w-full object-cover"
                  cldQuality="auto:good"
                  fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                />
              </div>
            ) : sideLayout === "split" ? (
              <>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[0] || fallbackImage}
                    alt={`${property?.title} - ảnh 2`}
                    width={800}
                    height={600}
                    sizes={TIER_SIDE_IMAGE_SIZES}
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                    fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                  />
                </div>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[1] || fallbackImage}
                    alt={`${property?.title} - ảnh 3`}
                    width={800}
                    height={600}
                    sizes={TIER_SIDE_IMAGE_SIZES}
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                    fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative h-1/2 w-full overflow-hidden">
                  <CloudinaryImage
                    src={sideImages[0] || fallbackImage}
                    alt={`${property?.title} - ảnh 2`}
                    width={800}
                    height={600}
                    sizes={TIER_SIDE_IMAGE_SIZES}
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                  />
                </div>
                <div className="flex h-1/2 w-full gap-0.5">
                  <div className="relative h-full w-1/2 overflow-hidden">
                    <CloudinaryImage
                      src={sideImages[1] || fallbackImage}
                      alt={`${property?.title} - ảnh 3`}
                      width={800}
                      height={600}
                      sizes={TIER_SIDE_SMALL_IMAGE_SIZES}
                      className="h-full w-full object-cover"
                      cldQuality="auto:good"
                      fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                    />
                  </div>
                  <div className="relative h-full w-1/2 overflow-hidden">
                    <CloudinaryImage
                      src={sideImages[2] || fallbackImage}
                      alt={`${property?.title} - ảnh 4`}
                      width={800}
                      height={600}
                      sizes={TIER_SIDE_SMALL_IMAGE_SIZES}
                      className="h-full w-full object-cover"
                      cldQuality="auto:good"
                      fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}

        <TierBadge tone="PREMIUM" />
        <ImageCountBadge count={realImageCount} />
      </div>

      <CardBody
        property={property}
        favoriteCount={favoriteCount}
        density="rich"
        tone="PREMIUM"
        showRooms
      />
      <CardHoverBar />
    </article>
  );
}

function StandardCard({
  property,
  favoriteCount,
  priority = false,
}: {
  property: Property;
  favoriteCount: number;
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
            alt={property?.title || "Bất động sản"}
            width={1200}
            height={800}
            priority={priority}
            sizes={TIER_MAIN_IMAGE_SIZES}
            className="h-full w-full object-cover"
            cldQuality="auto:good"
            fallbackSrc={DEFAULT_PROPERTY_IMAGE}
          />
        </div>

        {hasSideGallery ? (
          <div className="flex w-1/3 flex-col gap-0.5">
            {sideImages.length === 1 ? (
              <div className="relative h-full overflow-hidden">
                <CloudinaryImage
                  src={sideImages[0] || fallbackImage}
                  alt={`${property?.title} - ảnh phụ 1`}
                  width={800}
                  height={600}
                  sizes={TIER_SIDE_IMAGE_SIZES}
                  className="h-full w-full object-cover"
                  cldQuality="auto:good"
                  fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                />
              </div>
            ) : (
              sideImages.map((src, index) => (
                <div
                  key={`${property?.id}-right-thumb-${index}`}
                  className="relative h-1/2 overflow-hidden"
                >
                  <CloudinaryImage
                    src={src || fallbackImage}
                    alt={`${property?.title} - ảnh phụ ${index + 1}`}
                    width={800}
                    height={600}
                    sizes={TIER_SIDE_IMAGE_SIZES}
                    className="h-full w-full object-cover"
                    cldQuality="auto:good"
                    fallbackSrc={DEFAULT_PROPERTY_IMAGE}
                  />
                </div>
              ))
            )}
          </div>
        ) : null}

        <TierBadge tone="STANDARD" />
        <ImageCountBadge count={realImageCount} />
      </div>

      <CardBody
        property={property}
        favoriteCount={favoriteCount}
        density="rich"
        tone="STANDARD"
        showRooms
      />
      <CardHoverBar />
    </article>
  );
}

function FreeCard({
  property,
  favoriteCount,
  priority = false,
}: {
  property: Property;
  favoriteCount: number;
  priority?: boolean;
}) {
  const image = getPropertyThumbnailUrl(property);
  const realImageCount = getSortedPropertyImageUrls(property).length;

  return (
    <article className={`surface-utility ${CARD_HOVER_CLASSES}`}>
      <div className="relative h-40 overflow-hidden">
        <CloudinaryImage
          src={image}
          alt={property?.title || "Bất động sản"}
          width={1200}
          height={800}
          priority={priority}
          sizes={FREE_CARD_IMAGE_SIZES}
          className="h-full w-full object-cover"
          cldQuality="auto:good"
          fallbackSrc={DEFAULT_PROPERTY_IMAGE}
        />
        <TierBadge tone="FREE" />
        <ImageCountBadge count={realImageCount} />
      </div>

      <CardBody
        property={property}
        favoriteCount={favoriteCount}
        density="compact"
        tone="FREE"
        showRooms
      />
      <CardHoverBar />
    </article>
  );
}

function CardBody({
  property,
  favoriteCount,
  density,
  tone,
  showRooms = true,
}: {
  property: Property;
  favoriteCount: number;
  density: CardDensity;
  tone: CardTone;
  showRooms?: boolean;
}) {
  const location = formatLocationParts(
    [property?.ward?.name, property?.province?.name],
    "Đang cập nhật vị trí",
  );
  const isCompact = density === "compact";
  const bedroomsText = showRooms
    ? property?.bedrooms
      ? `${property?.bedrooms} phòng ngủ`
      : isCompact
        ? null
        : "Đang cập nhật phòng ngủ"
    : null;
  const bathroomsText = showRooms
    ? property?.bathrooms
      ? `${property?.bathrooms} phòng tắm`
      : isCompact
        ? null
        : "Đang cập nhật phòng tắm"
    : null;

  const metaItems = [
    { icon: MapPin, text: location },
    {
      icon: Maximize,
      text: formatAreaValue(property?.area, "Đang cập nhật diện tích"),
    },
    bedroomsText ? { icon: Bed, text: bedroomsText } : null,
    bathroomsText ? { icon: Bath, text: bathroomsText } : null,
  ].filter(Boolean) as Array<{ icon: typeof MapPin; text: string }>;

  const metaGridClass =
    tone === "PREMIUM" || tone === "STANDARD"
      ? "grid-cols-1"
      : isCompact
        ? "grid-cols-1"
        : "grid-cols-2";

  return (
    <div className="flex h-full flex-1 flex-col p-4">
      <span className="text-primary mb-2 inline-flex text-xs font-semibold lg:text-sm">
        {property?.displayCode} - {property?.category?.name}
      </span>

      <h3 className="text-heading group-hover:text-primary mb-2 line-clamp-2 overflow-hidden text-base leading-snug font-semibold tracking-[-0.02em] transition-colors duration-200 md:text-lg">
        {property?.title}
      </h3>

      <p className="group-hover:text-primary text-heading text-base font-semibold transition-colors duration-200">
        {formatNegotiablePrice(property?.price, property?.isNegotiable, {
          fallback: "Liên hệ",
          amount: property?.priceAmount,
          unit: property?.priceUnit,
        })}
      </p>

      <div
        className={`text-secondary my-2 grid gap-x-4 gap-y-1.5 ${metaGridClass}`}
      >
        {metaItems.map(({ icon: Icon, text }, index) => (
          <p
            key={`${property?.id}-meta-${index}`}
            className="flex items-start gap-1.5"
          >
            <Icon size={14} className="text-primary mt-0.5 shrink-0" />
            <span className="line-clamp-1 text-xs lg:text-sm">{text}</span>
          </p>
        ))}
      </div>

      <CardFooter property={property} favoriteCount={favoriteCount} />
    </div>
  );
}

export function PropertyCard({
  property,
  variant = "tier",
  priority = false,
}: {
  property: Property;
  variant?: "featured" | "lucky" | "tier";
  priority?: boolean;
}) {
  const href = resolvePropertyHref(property);
  const [favoriteCount, setFavoriteCount] = useState(
    property.favoriteCount ?? 0,
  );

  let content: ReactNode;

  if (variant === "featured") {
    content = (
      <FeaturedCard
        property={property}
        favoriteCount={favoriteCount}
        priority={priority}
      />
    );
  } else if (variant === "lucky") {
    content = (
      <LuckyCard
        property={property}
        favoriteCount={favoriteCount}
        priority={priority}
      />
    );
  } else {
    const tier = (property?.priorityStatus ?? "FREE") as PropertyPriority;
    switch (tier) {
      case "PREMIUM":
        content = (
          <PremiumCard
            property={property}
            favoriteCount={favoriteCount}
            priority={priority}
          />
        );
        break;
      case "STANDARD":
        content = (
          <StandardCard
            property={property}
            favoriteCount={favoriteCount}
            priority={priority}
          />
        );
        break;
      default:
        content = (
          <FreeCard
            property={property}
            favoriteCount={favoriteCount}
            priority={priority}
          />
        );
        break;
    }
  }

  return (
    <div className="relative h-full">
      <FavoriteButton
        entityType="PROPERTY"
        entityId={property.id}
        initialFavoriteCount={property.favoriteCount ?? 0}
        className="absolute top-3 right-3 z-10"
        analytics={{
          source: "property_card",
          listingType: "property",
          listingTitle: property.title,
          listingCode: property.displayCode,
          categoryId: property.categoryId,
          categoryName: property.category?.name,
          provinceId: property.provinceId,
          provinceName: property.province?.name,
          wardId: property.wardId,
          wardName: property.ward?.name,
          priceAmount: property.priceAmount,
          priceUnit: property.priceUnit,
          priorityStatus: property.priorityStatus,
        }}
        onToggleResult={(_, nextFavoriteCount) => {
          setFavoriteCount(nextFavoriteCount);
        }}
      />
      <Link
        href={href}
        className="block h-full"
        onClick={() =>
          trackEvent(ANALYTICS_EVENTS.clickPropertyListing, {
            source: "property_card",
            listing_type: "property",
            listing_id: property.id,
            listing_title: property.title,
            display_code: property.displayCode,
            category_id: property.categoryId,
            province_id: property.provinceId,
            ward_id: property.wardId,
            ward_name: property.ward?.name,
            priority_status: property.priorityStatus,
            price_amount: property.priceAmount,
          })
        }
      >
        {content}
      </Link>
    </div>
  );
}
