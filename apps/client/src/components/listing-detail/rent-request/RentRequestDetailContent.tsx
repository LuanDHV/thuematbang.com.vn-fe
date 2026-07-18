import {
  Bookmark,
  CalendarDays,
  Eye,
  Heart,
  Layers,
  MapPin,
  Maximize,
  Navigation,
  Wallet,
} from "lucide-react";

import FavoriteButton from "@/components/common/FavoriteButton";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { RentRequestCard } from "@/components/common/RentRequestCard";
import RentRequestDetailAnalytics from "@/components/listing-detail/rent-request/RentRequestDetailAnalytics";
import { DIRECTION_OPTIONS } from "@/constants/filter";
import { getRentRequestCoverImage } from "@/constants/rent-request";
import {
  formatDate,
  formatAreaValue,
  formatNumber,
  formatListingPrice,
} from "@/lib/format";
import { RentRequest } from "@/types/rent-request";

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

export default function RentRequestDetailContent({
  rentRequest,
  locationText,
  viewedRequests,
}: RentRequestDetailContentProps) {
  const hasArea = typeof rentRequest?.desiredArea === "number";
  const hasDirection = Boolean(rentRequest?.desiredDirection);
  const coverImage = getRentRequestCoverImage(rentRequest.category?.slug);

  return (
    <div className="surface-card flex w-full flex-col gap-6 p-5 lg:gap-8">
      <RentRequestDetailAnalytics
        listingId={rentRequest.id}
        listingTitle={rentRequest.title}
        displayCode={rentRequest.displayCode}
        categoryId={rentRequest.categoryId}
        provinceId={rentRequest.desiredProvinceId}
        wardId={rentRequest.desiredWardId}
        wardName={rentRequest.desiredWard?.name}
        isExpress={rentRequest.isExpress}
      />
      <div className="flex flex-col gap-6 lg:gap-8">
        <section>
          <div className="bg-surface-alt relative aspect-video w-full overflow-hidden rounded-2xl">
            <CloudinaryImage
              src={coverImage}
              alt={rentRequest?.title}
              width={1600}
              height={900}
              sizes="(max-width: 1024px) 100vw, 75vw"
              cldQuality="auto:good"
              className="h-full w-full object-cover"
              priority
              fallbackSrc={coverImage}
            />
          </div>
        </section>

        <section>
          <h1 className="text-heading text-2xl leading-tight font-semibold tracking-[-0.03em] lg:text-4xl">
            {rentRequest?.title}
          </h1>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-secondary flex flex-wrap items-center gap-2 text-sm">
              <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Bookmark size={14} className="text-primary" />
                Mã tin: {rentRequest?.displayCode}
              </span>

              <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Layers size={14} className="text-primary" />
                Danh mục: {rentRequest?.category?.name}
              </span>

              <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <CalendarDays size={14} className="text-primary" />
                Ngày đăng: {formatDate(rentRequest?.createdAt)}
              </span>

              <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Eye size={14} className="text-primary" />
                Lượt xem:{" "}
                {formatNumber(rentRequest?.viewCount, { fallback: "0" })}
              </span>

              <span className="surface-card inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                <Heart size={14} className="text-primary" />
                Lượt quan tâm:{" "}
                {formatNumber(rentRequest?.favoriteCount ?? 0, {
                  fallback: "0",
                })}
              </span>
            </div>

            <FavoriteButton
              entityType="RENT_REQUEST"
              entityId={rentRequest.id}
              initialFavoriteCount={rentRequest.favoriteCount ?? 0}
              className="relative z-0 self-center"
              analytics={{
                source: "rent_request_detail",
                listingType: "rent_request",
                listingTitle: rentRequest.title,
                listingCode: rentRequest.displayCode,
                categoryId: rentRequest.categoryId,
                categoryName: rentRequest.category?.name,
                provinceId: rentRequest.desiredProvinceId,
                provinceName: rentRequest.desiredProvince?.name,
                wardId: rentRequest.desiredWardId,
                wardName: rentRequest.desiredWard?.name,
                priceAmount: rentRequest.budgetAmount,
                priceUnit: rentRequest.budgetUnit,
              }}
            />
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-heading text-xl font-semibold">
              Thông tin chi tiết
            </h2>
          </div>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="surface-card flex items-center gap-3 px-3 py-3">
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

            <div className="surface-card flex items-center gap-3 px-3 py-3">
              <Wallet className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <p className="text-secondary text-xs tracking-wide uppercase">
                  Ngân sách
                </p>
                <p className="text-heading text-sm font-semibold">
                  {formatListingPrice(rentRequest?.budget, {
                    fallback: "Đang cập nhật",
                    amount: rentRequest?.budgetAmount,
                    unit: rentRequest?.budgetUnit,
                    negotiable: rentRequest?.isNegotiable,
                    negotiableLabel: "Thỏa thuận",
                  })}
                </p>
              </div>
            </div>

            {hasArea ? (
              <div className="surface-card flex items-center gap-3 px-3 py-3">
                <Maximize className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-secondary text-xs tracking-wide uppercase">
                    Diện tích cần thuê
                  </p>
                  <p className="text-heading text-sm font-semibold">
                    {formatAreaValue(rentRequest?.desiredArea)}
                  </p>
                </div>
              </div>
            ) : null}

            {hasDirection ? (
              <div className="surface-card flex items-center gap-3 px-3 py-3">
                <Navigation className="text-primary mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="text-secondary text-xs tracking-wide uppercase">
                    Hướng
                  </p>
                  <p className="text-heading text-sm font-semibold">
                    {getDirectionLabel(
                      rentRequest?.desiredDirection?.toString(),
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-heading text-xl font-semibold">
              Thông tin mô tả
            </h2>
          </div>
          {rentRequest?.requirementText ? (
            <div
              className="premium-prose prose prose-sm prose-p:leading-8 prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-[-0.02em] text-body max-w-none"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: rentRequest?.requirementText }}
            />
          ) : (
            <p className="text-secondary text-sm">
              Đang cập nhật thông tin mô tả.
            </p>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="bg-primary h-6 w-1 rounded-full" />
            <h2 className="text-heading text-xl font-semibold">
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
