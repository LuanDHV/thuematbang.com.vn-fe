"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      window.location.replace("/");
    }
  }, [secondsLeft]);

  return (
    <section className="bg-app relative isolate flex min-h-dvh items-center overflow-hidden">
      <div className="bg-primary/12 absolute top-16 left-1/2 h-56 w-56 translate-x-[-140%] rounded-full blur-3xl" />
      <div className="bg-primary/18 absolute right-1/2 bottom-8 h-72 w-72 translate-x-[130%] rounded-full blur-3xl" />

      <div className="layout-container layout-section-sm relative w-full">
        <div className="surface-panel mx-auto max-w-2xl space-y-6 px-6 py-10 text-center md:px-10 md:py-12">
          <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
            Lỗi Điều Hướng
          </p>

          <h1 className="text-heading animate-bounce text-7xl leading-none font-semibold tracking-[-0.04em] md:text-8xl">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="text-heading text-2xl font-semibold md:text-3xl">
              Trang bạn đang tìm không tồn tại
            </h2>
            <p className="text-secondary mx-auto max-w-xl text-sm leading-relaxed md:text-base">
              Liên kết có thể đã thay đổi, đã bị xóa hoặc chưa được xuất bản.
              Hãy quay lại trang chủ để tiếp tục tìm mặt bằng hoặc dự án phù
              hợp.
            </p>
            <p className="text-primary text-sm font-medium md:text-base">
              Tự động chuyển về trang chủ sau {secondsLeft}s
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/">Về trang chủ</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cho-thue">Xem tin cho thuê</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
