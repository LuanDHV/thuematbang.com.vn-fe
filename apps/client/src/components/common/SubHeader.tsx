import Link from "next/link";

export default function SubHeader() {
  return (
    <div className="bg-footer/95 border-footer-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md">
      <div className="layout-container flex h-10 items-center justify-center">
        <Link href="tel:0968688081" className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-footer-body text-[11px] font-bold tracking-[0.12em] uppercase">
            Hotline
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="text-primary text-sm font-bold tracking-wide whitespace-nowrap">
            0968 68 80 81
          </span>
        </Link>
      </div>
    </div>
  );
}
