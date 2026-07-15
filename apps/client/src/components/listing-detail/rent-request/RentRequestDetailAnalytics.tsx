"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { sanitizeAnalyticsText, trackEvent } from "@/lib/analytics/track-event";

type RentRequestDetailAnalyticsProps = {
  listingId: number;
  listingTitle?: string | null;
  displayCode?: string | null;
  categoryId?: number | null;
  provinceId?: number | null;
  wardId?: number | null;
  wardName?: string | null;
  isExpress?: boolean | null;
};

export default function RentRequestDetailAnalytics({
  listingId,
  listingTitle,
  displayCode,
  categoryId,
  provinceId,
  wardId,
  wardName,
  isExpress,
}: RentRequestDetailAnalyticsProps) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.viewRentRequestDetail, {
      source: "rent_request_detail",
      listing_type: "rent_request",
      listing_id: listingId,
      listing_title: listingTitle,
      display_code: displayCode,
      category_id: categoryId,
      province_id: provinceId,
      ward_id: wardId,
      ward_name: sanitizeAnalyticsText(wardName),
      is_express: isExpress,
    });
  }, [
    categoryId,
    displayCode,
    isExpress,
    listingId,
    listingTitle,
    provinceId,
    wardId,
    wardName,
  ]);

  return null;
}
