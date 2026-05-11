import Link from "next/link";
import { Button } from "../ui/button";

interface SeeMoreButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

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
      <div className="mt-12 text-center">
        <Button
          type="button"
          size="lg"
          onClick={onClick}
          disabled={disabled}
          className="border-primary hover:bg-primary shadow-primary/10 text-primary hover:-trangray-y-1 h-10 min-w-60 cursor-pointer rounded-lg bg-white px-4 font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Xem thêm
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 text-center">
        <Link href={`${href}`}>
          <Button
            size="lg"
            className="border-primary hover:bg-primary shadow-primary/10 text-primary hover:-trangray-y-1 h-10 min-w-60 cursor-pointer rounded-lg bg-white px-4 font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 hover:text-white"
          >
            Xem thêm
          </Button>
        </Link>
      </div>
    </>
  );
}
