"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  content: string;
};

export default function PageSeoContentCollapsible({ content }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ${
          isExpanded ? "max-h-none" : "max-h-72 md:max-h-80"
        }`}
      >
        <div
          className="premium-prose prose prose-sm prose-p:leading-relaxed prose-headings:font-semibold text-body max-w-none"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {!isExpanded ? (
        <div className="from-surface pointer-events-none absolute right-0 bottom-14 left-0 h-20 bg-linear-to-t to-transparent" />
      ) : null}

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="bg-primary hover:bg-primary/90 inline-flex h-10 min-w-40 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-5 text-xs font-bold tracking-[0.16em] text-white uppercase shadow-md shadow-orange-200/50 transition-colors sm:min-w-44"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
