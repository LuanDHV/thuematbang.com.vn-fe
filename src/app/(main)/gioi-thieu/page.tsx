import type { Metadata } from "next";

import { createPageMetadata } from "@/lib/metadata";

import {
  AboutPageHero,
  AboutPageOverview,
  AboutPageLeadership,
  AboutPageReasonsStats,
  AboutPageTimeline,
} from "@/components/common/AboutSection";

export const metadata: Metadata = createPageMetadata({
  title: "Giới thiệu",
  description:
    "Tìm hiểu lịch sử hình thành, năng lực công ty, ban lãnh đạo và lý do Thuematbang.com.vn là đơn vị đồng hành trong lĩnh vực cho thuê bất động sản thương mại.",
  pathname: "/gioi-thieu",
});

export default function GioiThieuPage() {
  return (
    <section className="bg-app relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute top-14 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute right-0 bottom-0 h-72 w-72 translate-x-1/3 rounded-full blur-3xl"
      />

      <div className="layout-container layout-section-md relative">
        <AboutPageHero />
        <AboutPageOverview />
        <AboutPageTimeline />
        <AboutPageLeadership />
        <AboutPageReasonsStats />
      </div>
    </section>
  );
}
