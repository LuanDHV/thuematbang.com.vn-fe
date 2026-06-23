"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const scrollTopClassName =
  "interactive-lift inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/35 bg-primary text-white shadow-[var(--shadow-float)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!showScrollTop) return null;

  return (
    <div className="fixed right-4 bottom-5 z-70 md:right-6 md:bottom-6">
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className={scrollTopClassName}
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
