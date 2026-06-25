import Link from "next/link";
import { Button } from "../ui/button";

interface SeeMoreButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const CTA_CLASS_NAME =
  "h-11 min-w-60 rounded-xl border-primary/20 bg-surface px-5 font-semibold tracking-[0.12em] uppercase text-primary shadow-lg transition-colors duration-300 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

export default function SeeMoreButton({
  href,
  onClick,
  disabled = false,
}: SeeMoreButtonProps) {
  if (!href && !onClick) {
    return null;
  }

  if (onClick) {
    return (
      <div className="mt-8 text-center">
        <Button
          type="button"
          size="lg"
          onClick={onClick}
          disabled={disabled}
          className={CTA_CLASS_NAME}
        >
          Xem thêm
        </Button>
      </div>
    );
  }

  const resolvedHref = href!;

  return (
    <div className="mt-8 text-center">
      <Button asChild size="lg" className={CTA_CLASS_NAME}>
        <Link
          href={
            resolvedHref.startsWith("/") ? resolvedHref : `/${resolvedHref}`
          }
        >
          Xem thêm
        </Link>
      </Button>
    </div>
  );
}
