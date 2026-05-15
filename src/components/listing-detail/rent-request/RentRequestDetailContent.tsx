import { MapPin, Maximize, Navigation, Wallet } from "lucide-react";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import { formatDate, formatPrice } from "@/lib/utils";
import { DIRECTION_OPTIONS } from "@/mocks/filter";
import { RentRequest } from "@/types/rent-request";
import Image from "next/image";

type RentRequestDetailContentProps = {
  rentRequest: RentRequest;
  locationText: string;
  featuredRequests: RentRequest[];
  viewedRequests: RentRequest[];
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

export default function RentRequestDetailContent({
  rentRequest,
  locationText,
  featuredRequests,
  viewedRequests,
}: RentRequestDetailContentProps) {
  const hasArea =
    (rentRequest.minArea ?? 0) > 0 || (rentRequest.maxArea ?? 0) > 0;
  const hasDirection = Boolean(rentRequest.preferredDirection);
  const categoryName = rentRequest.category?.name ?? "";
  const hasCategoryName = Boolean(categoryName);

  return (
    <div className="w-full space-y-6 lg:w-3/4 lg:space-y-8">
      <section>
        <div className="aspect-image relative w-full overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={rentRequest.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
            alt={rentRequest.title}
            fill
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-5">
          <h1 className="text-2xl leading-tight font-bold text-gray-800 lg:text-4xl">
            {rentRequest.title}
          </h1>

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
            Nhu cầu thuê chi tiết
          </h2>
        </div>
        <div className="mt-4">
          <p className="mt-5 whitespace-pre-line text-gray-700">
            {rentRequest.requirementText || "Đang cập nhật nội dung nhu cầu."}
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Tiêu chí cần thuê
          </h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {hasArea ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Maximize size={14} className="text-gray-500" />
                Diện tích cần thuê
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {formatAreaRange(rentRequest)}
              </p>
            </div>
          ) : null}

          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
              <Wallet size={14} className="text-gray-500" />
              Ngân sách
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatBudgetRange(rentRequest)}
            </p>
          </div>

          {hasDirection ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-2 text-xs tracking-wide text-gray-500 uppercase">
                <Navigation size={14} className="text-gray-500" />
                Hướng
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {getDirectionLabel(rentRequest.preferredDirection?.toString())}
              </p>
            </div>
          ) : null}

          {hasCategoryName ? (
            <div className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-xs tracking-wide text-gray-500 uppercase">
                Danh mục
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {categoryName}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin thêm
          </h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày đăng
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(rentRequest.createdAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Ngày hết hạn
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {formatDate(rentRequest.expiredAt || rentRequest.updatedAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-gray-50 px-4 py-3">
            <p className="text-xs tracking-wide text-gray-500 uppercase">
              Mã tin
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              #{rentRequest.id}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3">
          <span className="bg-primary h-6 w-1 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-800">
            Nhu cầu cần thuê tương tự
          </h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {featuredRequests.map((item) => (
            <RentRequestCard
              key={`suggested-${item.id}`}
              request={item}
              variant="featured"
            />
          ))}
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
          {viewedRequests.map((item) => (
            <RentRequestCard
              key={`viewed-${item.id}`}
              request={item}
              variant="featured"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
