import Link from "next/link";

export default function SubHeader() {
  return (
    <div className="bg-primary fixed top-0 right-0 left-0 z-50 border-b border-white/20 shadow-sm shadow-orange-950/10 backdrop-blur-md">
      <div className="layout-container flex h-10 items-center justify-center">
        <Link href="tel:0968688081" className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white uppercase">
            Hotline
          </span>
          <span className="h-3 w-px bg-white/30" />
          <span className="text-xs font-semibold tracking-wide text-white">
            0968 68 80 81
          </span>
        </Link>
      </div>
    </div>
  );
}
