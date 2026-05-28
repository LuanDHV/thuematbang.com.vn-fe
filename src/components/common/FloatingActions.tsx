"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUp } from "lucide-react";

const scrollTopClassName =
  "interactive-lift inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-primary/35 bg-primary text-white shadow-[0_10px_24px_rgba(251,170,25,0.32),0_0_0_4px_rgba(251,170,25,0.14)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35";

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

  const wrapperClassName = useMemo(
    () => "fixed right-4 bottom-5 z-[70] md:right-6 md:bottom-6",
    [],
  );

  if (!showScrollTop) return null;

  return (
    <div className={wrapperClassName}>
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
