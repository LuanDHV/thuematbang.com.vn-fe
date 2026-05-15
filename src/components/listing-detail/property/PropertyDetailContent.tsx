import { Bath, Bed, MapPin, Maximize, Navigation } from "lucide-react";
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
  const hasPriorityStatus = Boolean(property.priorityStatus);

  return (
    <div className="w-full space-y-6 lg:w-3/4 lg:space-y-8">
      <section>
        <PropertyImageGallery title={property.title} images={galleryImages} />

        <div className="mt-5">
          <h1 className="text-2xl leading-tight font-bold text-gray-800 lg:text-4xl">
            {property.title}
          </h1>
          <p className="text-primary mt-2 text-3xl font-bold tracking-tight">
            {formatPrice(property.price || 0)}
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
            <span>{locationText || "Đang cập nhật địa chỉ"}</span>
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin mô tả
          </h2>
        </div>
        <div className="mt-4">
          {property.content ? (
            <div
              className="prose prose-sm mt-5 max-w-none text-gray-700"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: property.content }}
            />
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Đặc điểm bất động sản
          </h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {hasArea ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Maximize size={14} className="text-gray-500" />
                Diện tích
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {property.area} m²
              </p>
            </div>
          ) : null}
          {hasBathrooms ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Bath size={14} className="text-gray-500" />
                Phòng tắm
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {property.bathrooms}
              </p>
            </div>
          ) : null}
          {hasBedrooms ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Bed size={14} className="text-gray-500" />
                Phòng ngủ
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {property.bedrooms}
              </p>
            </div>
          ) : null}
          {hasDirection ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Navigation size={14} className="text-gray-500" />
                Hướng
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {getDirectionLabel(property.direction?.toString())}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
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
            className="mt-4 h-80 w-full rounded-2xl"
          />
        ) : (
          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            Tin đăng chưa có tọa độ để hiển thị bản đồ.
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày đăng
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(property.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày hết hạn
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(property.boostEndAt || property.updatedAt)}
            </p>
          </div>
          {hasPriorityStatus ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Loại tin
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800 capitalize">
                {property.priorityStatus}
              </p>
            </div>
          ) : null}
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Mã tin
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              #{property.id}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Bất động sản đã xem
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
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
