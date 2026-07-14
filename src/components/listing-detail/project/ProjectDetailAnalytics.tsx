"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { sanitizeAnalyticsText, trackEvent } from "@/lib/analytics/track-event";

type ProjectDetailAnalyticsProps = {
  listingId: number;
  listingTitle?: string | null;
  displayCode?: string | null;
  categoryId?: number | null;
  provinceId?: number | null;
  wardId?: number | null;
  wardName?: string | null;
};

export default function ProjectDetailAnalytics({
  listingId,
  listingTitle,
  displayCode,
  categoryId,
  provinceId,
  wardId,
  wardName,
}: ProjectDetailAnalyticsProps) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.viewProjectDetail, {
      source: "project_detail",
      listing_type: "project",
      listing_id: listingId,
      listing_title: listingTitle,
      display_code: displayCode,
      category_id: categoryId,
      province_id: provinceId,
      ward_id: wardId,
      ward_name: sanitizeAnalyticsText(wardName),
    });
  }, [
    categoryId,
    displayCode,
    listingId,
    listingTitle,
    provinceId,
    wardId,
    wardName,
  ]);

  return null;
}
