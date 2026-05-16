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
import { DIRECTION_OPTIONS } from "@/mocks/filter";
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
    <div className="w-full space-y-6 lg:w-3/4 lg:space-y-8">
      <section>
        <PropertyImageGallery title={property.title} images={galleryImages} />
      </section>

      <section>
        <h1 className="text-2xl leading-tight font-bold text-gray-800 lg:text-4xl">
          {property.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          {property.category?.name ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              <Layers size={12} className="text-primary" />
              Danh mục: {property.category.name}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <Tag size={12} className="text-primary" />
            Loại tin đăng: {property.priorityStatus}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <CalendarDays size={12} className="text-primary" />
            Ngày đăng: {formatDate(property.createdAt)}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <Eye size={12} className="text-primary" />
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
            className="prose prose-sm prose-gray prose-headings:font-semibold prose-p:leading-relaxed max-w-none text-gray-700"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: property.content }}
          />
        ) : (
          <p className="text-sm text-gray-600">
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
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
            <Wallet className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Giá thuê
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {formatPrice(property.price || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
            <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Địa chỉ
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {locationText || "Đang cập nhật"}
              </p>
            </div>
          </div>

          {hasArea ? (
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <Maximize className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Diện tích
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {property.area} m²
                </p>
              </div>
            </div>
          ) : null}

          {hasBedrooms ? (
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <Bed className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Phòng ngủ
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {property.bedrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasBathrooms ? (
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <Bath className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Phòng tắm
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {property.bathrooms}
                </p>
              </div>
            </div>
          ) : null}

          {hasDirection ? (
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <Navigation className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Hướng
                </p>
                <p className="text-sm font-semibold text-gray-800">
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
            className="h-80 w-full rounded-2xl"
          />
        ) : (
          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
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
        <p className="text-sm text-gray-500">
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
