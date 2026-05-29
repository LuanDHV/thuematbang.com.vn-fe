import {
  Bath,
  Bed,
  CalendarDays,
  Eye,
  Layers,
  MapPin,
  Maximize,
  Navigation,
  Tag,
  Wallet,
} from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import { formatDate, formatPrice } from "@/lib/utils";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { Property } from "@/types/property";

type PropertyDetailContentProps = {
  property: Property;
  locationText: string;
  galleryImages: string[];
  mapSrc: string | null;
  featuredProperties: Property[];
  viewedProperties: Property[];
};

function getDirectionLabel(direction?: string | null) {
  if (!direction) return "Đang cập nhật";
  const normalized = direction.toString().toUpperCase();
  return (
    DIRECTION_OPTIONS.find((option) => option.id === normalized)?.label ??
    direction
  );
}

export default function PropertyDetailContent({
  property,
  locationText,
  galleryImages,
  mapSrc,
  featuredProperties,
  viewedProperties,
}: PropertyDetailContentProps) {
  const hasArea = typeof property.area === "number" && property.area > 0;
  const hasBathrooms =
    typeof property.bathrooms === "number" && property.bathrooms > 0;
  const hasBedrooms =
    typeof property.bedrooms === "number" && property.bedrooms > 0;
  const hasDirection = Boolean(property.direction);

  return (
    <div className="surface-card flex flex-col gap-6 p-5 lg:gap-8">
      <section>
        <PropertyImageGallery title={property.title} images={galleryImages} />
      </section>

      <section>
        <h1 className="text-heading text-2xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
          {property.title}
        </h1>

        <div className="text-secondary mt-3 flex flex-wrap items-center gap-2 text-sm">
          {property.category?.name ? (
            <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
              <Layers size={14} className="text-primary" />
              Danh mục: {property.category.name}
            </span>
          ) : null}

          <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Tag size={14} className="text-primary" />
            Loại tin đăng: {property.priorityStatus}
          </span>

          <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <CalendarDays size={14} className="text-primary" />
            Ngày đăng: {formatDate(property.createdAt)}
          </span>

          <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
            <Eye size={14} className="text-primary" />
            Lượt xem: {(property.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin mô tả
          </h2>
        </div>
        {property.content ? (
          <div
            className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: property.content }}
          />
        ) : (
          <p className="text-secondary text-sm">
            Đang cập nhật thông tin mô tả.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin chi tiết
          </h2>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
            <Wallet className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-secondary text-xs tracking-wide uppercase">
                Giá thuê
              </p>
              <p className="text-heading text-sm font-semibold">
                {formatPrice(property.price || 0)}
              </p>
            </div>
          </div>

          <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
            <MapPin className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-secondary text-xs tracking-wide uppercase">
                Địa chỉ
              </p>
              <p className="text-heading text-sm font-semibold">
                {locationText || "Đang cập nhật"}
              </p>
            </div>
          </div>

          {hasArea ? (
            <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
              <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Diện tích
                </p>
                <p className="text-heading text-sm font-semibold">
                  {property.area} m²
                </p>
              </div>
            </div>
          ) : null}

          {hasBedrooms ? (
            <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
              <Bed className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Phòng ngủ
                </p>
                <p className="text-heading text-sm font-semibold">
                  {property.bedrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasBathrooms ? (
            <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
              <Bath className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Phòng tắm
                </p>
                <p className="text-heading text-sm font-semibold">
                  {property.bathrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasDirection ? (
            <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
              <Navigation className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Hướng
                </p>
                <p className="text-heading text-sm font-semibold">
                  {getDirectionLabel(property.direction?.toString())}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Xem trên bản đồ
          </h2>
        </div>

        {mapSrc ? (
          <iframe
            title={`Bản đồ vị trí ${property.title}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full rounded-2xl border border-black/6 shadow-[0_18px_36px_rgba(36,26,10,0.08)]"
          />
        ) : (
          <div className="surface-card text-secondary rounded-2xl p-4 text-sm">
            Tin đăng chưa có tọa độ để hiển thị bản đồ.
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6">
        {/* Phần 1: Bất động sản dành cho bạn */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-800">
              Bất động sản dành cho bạn
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {featuredProperties.map((item) => (
              <PropertyCard
                key={`suggested-${item.id}`}
                property={item}
                variant="featured"
              />
            ))}
          </div>
        </div>

        {/* Phần 2: Bất động sản đã xem */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-800">
              Bất động sản đã xem
            </h2>
          </div>
          <p className="text-secondary text-sm">
            Hiện đang hiển thị mẫu. Có thể thay bằng dữ liệu lịch sử xem thật từ
            localStorage/cookie.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {viewedProperties.map((item) => (
              <PropertyCard
                key={`viewed-${item.id}`}
                property={item}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
