import {
  CalendarDays,
  Eye,
  Layers,
  MapPin,
  Maximize,
  Navigation,
  Wallet,
} from "lucide-react";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import { formatDate, formatPrice } from "@/lib/utils";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { RentRequest } from "@/types/rent-request";
import CloudinaryImage from "@/components/common/CloudinaryImage";

type RentRequestDetailContentProps = {
  rentRequest: RentRequest;
  locationText: string;
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
  viewedRequests,
}: RentRequestDetailContentProps) {
  const hasArea =
    (rentRequest.minArea ?? 0) > 0 || (rentRequest.maxArea ?? 0) > 0;
  const hasDirection = Boolean(rentRequest.preferredDirection);
  const categoryName = rentRequest.category?.name ?? "";

  return (
    <div className="flex w-full flex-col gap-6 lg:w-3/4 lg:gap-8">
      <div className="flex flex-col gap-6 lg:gap-8">
        <section>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
            <CloudinaryImage
              src={rentRequest.imageUrl || "/imgs/wallpaper-1.jpg"}
              alt={rentRequest.title}
              fill
              sizes="(max-width: 1024px) 100vw, 75vw"
              cldQuality="auto:best"
              className="object-cover"
              priority
            />
          </div>
        </section>

        <section>
          <h1 className="text-heading text-2xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
            {rentRequest.title}
          </h1>

          <div className="text-secondary mt-3 flex flex-wrap items-center gap-2 text-sm">
            {categoryName ? (
              <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Layers size={12} className="text-primary" />
                Danh mục: {categoryName}
              </span>
            ) : null}

            <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium">
              <CalendarDays size={12} className="text-primary" />
              Ngày đăng: {formatDate(rentRequest.createdAt)}
            </span>

            <span className="text-secondary surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-medium">
              <Eye size={12} className="text-primary" />
              Lượt xem: {(rentRequest.viewCount || 0).toLocaleString("vi-VN")}
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
          <p className="text-body whitespace-pre-line">
            {rentRequest.requirementText || "Đang cập nhật thông tin mô tả."}
          </p>
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
              <MapPin className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Khu vực
                </p>
                <p className="text-heading text-sm font-semibold">
                  {locationText || "Đang cập nhật"}
                </p>
              </div>
            </div>

            <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
              <Wallet className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Ngân sách
                </p>
                <p className="text-heading text-sm font-semibold">
                  {formatBudgetRange(rentRequest)}
                </p>
              </div>
            </div>

            {hasArea ? (
              <div className="surface-card flex items-center gap-3 rounded-xl px-3 py-3">
                <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-secondary text-xs tracking-wide uppercase">
                    Diện tích cần thuê
                  </p>
                  <p className="text-heading font-mono text-sm font-semibold">
                    {formatAreaRange(rentRequest)}
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
                    {getDirectionLabel(
                      rentRequest.preferredDirection?.toString(),
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-xl font-semibold text-gray-800">
              Bất động sản đã xem
            </h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {viewedRequests.map((item) => (
              <RentRequestCard
                key={`viewed-${item.id}`}
                request={item}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
