"use client";

import { useEffect } from "react";

import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";

type NewsDetailAnalyticsProps = {
  listingId: number;
  listingTitle?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  isFeatured?: boolean | null;
};

export default function NewsDetailAnalytics({
  listingId,
  listingTitle,
  categoryId,
  categoryName,
  isFeatured,
}: NewsDetailAnalyticsProps) {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.viewNewsDetail, {
      source: "news_detail",
      listing_type: "news",
      listing_id: listingId,
      listing_title: listingTitle,
      category_id: categoryId,
      category_name: categoryName,
      is_featured: Boolean(isFeatured),
    });
  }, [categoryId, categoryName, isFeatured, listingId, listingTitle]);

  return null;
}
