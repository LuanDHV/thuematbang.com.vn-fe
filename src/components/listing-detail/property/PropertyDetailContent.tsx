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
    <div className="flex flex-col w-full gap-6 lg:w-3/4 lg:gap-8">
      <section className="surface-card overflow-hidden p-2">
        <PropertyImageGallery title={property.title} images={galleryImages} />
      </section>

      <section className="surface-panel p-6 md:p-7">
        <h1 className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-heading lg:text-4xl">
          {property.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-secondary">
          {property.category?.name ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-secondary">
              <Layers size={12} className="text-primary" />
              Danh mục: {property.category.name}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-secondary">
            <Tag size={12} className="text-primary" />
            Loại tin đăng: {property.priorityStatus}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-secondary">
            <CalendarDays size={12} className="text-primary" />
            Ngày đăng: {formatDate(property.createdAt)}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-secondary">
            <Eye size={12} className="text-primary" />
            Lượt xem: {(property.viewCount || 0).toLocaleString("vi-VN")}
          </span>
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin mô tả
          </h2>
        </div>
        {property.content ? (
          <div
            className="premium-prose prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-semibold text-body"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: property.content }}
          />
        ) : (
          <p className="text-sm text-secondary">
            Đang cập nhật thông tin mô tả.
          </p>
        )}
      </section>

      <section className="surface-card p-6 md:p-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin chi tiết
          </h2>
        </div>

        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
            <Wallet className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-xs tracking-wide text-secondary uppercase">
                Giá thuê
              </p>
              <p className="metric-mono text-sm font-semibold text-heading">
                {formatPrice(property.price || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
            <MapPin className="text-primary mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-xs tracking-wide text-secondary uppercase">
                Địa chỉ
              </p>
              <p className="text-sm font-semibold text-heading">
                {locationText || "Đang cập nhật"}
              </p>
            </div>
          </div>

          {hasArea ? (
            <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
              <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-secondary uppercase">
                  Diện tích
                </p>
                <p className="metric-mono text-sm font-semibold text-heading">
                  {property.area} m²
                </p>
              </div>
            </div>
          ) : null}

          {hasBedrooms ? (
            <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
              <Bed className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-secondary uppercase">
                  Phòng ngủ
                </p>
                <p className="metric-mono text-sm font-semibold text-heading">
                  {property.bedrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasBathrooms ? (
            <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
              <Bath className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-secondary uppercase">
                  Phòng tắm
                </p>
                <p className="metric-mono text-sm font-semibold text-heading">
                  {property.bathrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasDirection ? (
            <div className="flex items-center gap-3 rounded-xl bg-app/70 px-3 py-3">
              <Navigation className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-secondary uppercase">
                  Hướng
                </p>
                <p className="text-sm font-semibold text-heading">
                  {getDirectionLabel(property.direction?.toString())}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="surface-card p-6 md:p-7">
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
          <div className="surface-panel rounded-2xl p-4 text-sm text-secondary">
            Tin đăng chưa có tọa độ để hiển thị bản đồ.
          </div>
        )}
      </section>

      <section>
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
      </section>

      <section>
        <div className="mb-3 flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Bất động sản đã xem
          </h2>
        </div>
        <p className="text-sm text-secondary">
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
      </section>
    </div>
  );
}
