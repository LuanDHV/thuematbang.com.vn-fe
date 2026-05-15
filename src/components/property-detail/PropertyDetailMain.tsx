import { Bath, Bed, MapPin, Maximize, Navigation, Wallet } from "lucide-react";
import { PropertyCard } from "@/components/common/PropertyCard";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";
import { formatDate, formatPrice } from "@/lib/utils";
import { DIRECTION_OPTIONS } from "@/mocks/filter";
import { Property } from "@/types/property";
import { RentRequest } from "@/types/rent-request";

type ListingMode = "property" | "rentRequest";

type PropertyDetailMainProps = {
  listing: Property | RentRequest;
  listingMode?: ListingMode;
  locationText: string;
  galleryImages: string[];
  mapSrc: string | null;
  featuredItems: (Property | RentRequest)[];
  viewedItems: (Property | RentRequest)[];
};

function getDirectionLabel(direction?: string | null) {
  if (!direction) return "Đang cập nhật";
  const normalized = direction.toString().toUpperCase();
  return (
    DIRECTION_OPTIONS.find((option) => option.id === normalized)?.label ??
    direction
  );
}

function formatBudgetRange(request: RentRequest) {
  const min = request.minBudget ?? 0;
  const max = request.maxBudget ?? 0;

  if (min > 0 && max > 0) return `${formatPrice(min)} - ${formatPrice(max)}`;
  if (min > 0) return `Từ ${formatPrice(min)}`;
  if (max > 0) return `Dưới ${formatPrice(max)}`;
  return "Thỏa thuận";
}

function formatAreaRange(request: RentRequest) {
  const min = request.minArea ?? 0;
  const max = request.maxArea ?? 0;

  if (min > 0 && max > 0) return `${min} - ${max} m²`;
  if (min > 0) return `Từ ${min} m²`;
  if (max > 0) return `Dưới ${max} m²`;
  return "Đang cập nhật";
}

function renderRelatedCard(item: Property | RentRequest, mode: ListingMode) {
  if (mode === "rentRequest") {
    return (
      <RentRequestCard
        key={`rent-request-${item.id}`}
        request={item as RentRequest}
        variant="featured"
      />
    );
  }

  return (
    <PropertyCard
      key={`property-${item.id}`}
      property={item as Property}
      variant="featured"
    />
  );
}

export default function PropertyDetailMain({
  listing,
  listingMode = "property",
  locationText,
  galleryImages,
  mapSrc,
  featuredItems,
  viewedItems,
}: PropertyDetailMainProps) {
  const isRentRequest = listingMode === "rentRequest";
  const property = listing as Property;
  const rentRequest = listing as RentRequest;

  const hasArea =
    listingMode === "property"
      ? typeof property.area === "number" && property.area > 0
      : (rentRequest.minArea ?? 0) > 0 || (rentRequest.maxArea ?? 0) > 0;
  const hasBathrooms =
    listingMode === "property" &&
    typeof property.bathrooms === "number" &&
    property.bathrooms > 0;
  const hasBedrooms =
    listingMode === "property" &&
    typeof property.bedrooms === "number" &&
    property.bedrooms > 0;
  const hasDirection = isRentRequest
    ? Boolean(rentRequest.preferredDirection)
    : Boolean(property.direction);
  const hasPriorityStatus = !isRentRequest && Boolean(property.priorityStatus);
  const hasBusinessType = Boolean(rentRequest.businessType);

  return (
    <div className="w-full space-y-6 lg:w-3/4 lg:space-y-8">
      <section>
        <PropertyImageGallery title={listing.title} images={galleryImages} />

        <div className="mt-5">
          <h1 className="text-2xl leading-tight font-bold text-gray-800 lg:text-4xl">
            {listing.title}
          </h1>
          <p className="text-primary mt-2 text-3xl font-bold tracking-tight">
            {isRentRequest
              ? formatBudgetRange(rentRequest)
              : formatPrice(property.price || 0)}
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
            {isRentRequest ? "Nhu cầu thuê chi tiết" : "Thông tin mô tả"}
          </h2>
        </div>
        <div className="mt-4">
          {isRentRequest ? (
            <p className="mt-5 whitespace-pre-line text-gray-700">
              {rentRequest.requirementText || "Đang cập nhật nội dung nhu cầu."}
            </p>
          ) : property.content ? (
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
            {isRentRequest ? "Tiêu chí cần thuê" : "Đặc điểm bất động sản"}
          </h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {hasArea ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Maximize size={14} className="text-gray-500" />
                {isRentRequest ? "Diện tích cần thuê" : "Diện tích"}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {isRentRequest
                  ? formatAreaRange(rentRequest)
                  : `${property.area} m²`}
              </p>
            </div>
          ) : null}

          {isRentRequest ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Wallet size={14} className="text-gray-500" />
                Ngân sách
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {formatBudgetRange(rentRequest)}
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
                {getDirectionLabel(
                  isRentRequest
                    ? rentRequest.preferredDirection?.toString()
                    : property.direction?.toString(),
                )}
              </p>
            </div>
          ) : null}

          {hasBusinessType ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Ngành nghề
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {rentRequest.businessType}
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
            title={`Bản đồ vị trí ${listing.title}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-4 h-80 w-full rounded-2xl"
          />
        ) : (
          <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            {isRentRequest
              ? "Nhu cầu cần thuê không yêu cầu tọa độ bản đồ."
              : "Tin đăng chưa có tọa độ để hiển thị bản đồ."}
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày đăng
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(listing.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày hết hạn
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(
                isRentRequest
                  ? rentRequest.expiredAt || rentRequest.updatedAt
                  : property.boostEndAt || property.updatedAt,
              )}
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
              #{listing.id}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            {isRentRequest
              ? "Nhu cầu cần thuê tương tự"
              : "Bất động sản dành cho bạn"}
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {featuredItems.map((item) => renderRelatedCard(item, listingMode))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">Tin đã xem</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Hiện đang hiển thị mẫu. Có thể thay bằng dữ liệu lịch sử xem thật từ
          localStorage/cookie.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {viewedItems.map((item) => renderRelatedCard(item, listingMode))}
        </div>
      </section>
    </div>
  );
}
