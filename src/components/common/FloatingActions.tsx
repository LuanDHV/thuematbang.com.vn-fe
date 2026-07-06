"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed right-4 bottom-5 z-70 transition-all duration-300 md:right-6 md:bottom-6",
        showScrollTop
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <button
        type="button"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="interactive-lift border-primary/35 bg-primary focus-visible:ring-primary/35 inline-flex size-12 cursor-pointer items-center justify-center rounded-full border text-white shadow-2xl transition hover:brightness-105 focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Về đầu trang"
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
