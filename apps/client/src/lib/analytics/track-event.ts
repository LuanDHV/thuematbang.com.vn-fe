import type { AnalyticsEventName } from "@/lib/analytics/events";

type AnalyticsPrimitive = string | number | boolean | null | undefined;

export type AnalyticsEventParams = Record<string, AnalyticsPrimitive>;

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_PATTERN = /(?:\+?84|0)(?:[\s.-]?\d){8,10}/g;

export function sanitizeAnalyticsText(value?: string | null, maxLength = 120) {
  if (!value) {
    return undefined;
  }

  const sanitized = value
    .replace(EMAIL_PATTERN, "[email]")
    .replace(PHONE_PATTERN, "[phone]")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized.length > maxLength
    ? `${sanitized.slice(0, maxLength).trim()}...`
    : sanitized;
}

export function trackEvent(
  event: AnalyticsEventName,
  params: AnalyticsEventParams = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    app: "thuematbang_fe",
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...params,
  });
}
