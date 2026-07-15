"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { sanitizeAnalyticsText, trackEvent } from "@/lib/analytics/track-event";

type PropertyDetailAnalyticsProps = {
  listingId: number;
  listingTitle?: string | null;
  displayCode?: string | null;
  categoryId?: number | null;
  provinceId?: number | null;
  wardId?: number | null;
  wardName?: string | null;
  priorityStatus?: string | null;
};

export default function PropertyDetailAnalytics({
  listingId,
  listingTitle,
  displayCode,
  categoryId,
  provinceId,
  wardId,
  wardName,
  priorityStatus,
}: PropertyDetailAnalyticsProps) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.viewPropertyDetail, {
      source: "property_detail",
      listing_type: "property",
      listing_id: listingId,
      listing_title: listingTitle,
      display_code: displayCode,
      category_id: categoryId,
      province_id: provinceId,
      ward_id: wardId,
      ward_name: sanitizeAnalyticsText(wardName),
      priority_status: priorityStatus,
    });
  }, [
    categoryId,
    displayCode,
    listingId,
    listingTitle,
    priorityStatus,
    provinceId,
    wardId,
    wardName,
  ]);

  return null;
}
