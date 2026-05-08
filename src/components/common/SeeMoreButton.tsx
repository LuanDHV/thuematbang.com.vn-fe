import Link from "next/link";
import { Button } from "../ui/button";

interface SeeMoreButtonProps {
  href: string;
}

export default function SeeMoreButton({ href }: SeeMoreButtonProps) {
  return (
    <>
      <div className="mt-12 text-center">
        <Link href={`${href}`}>
          <Button
            size="lg"
            className="border-primary hover:bg-primary shadow-primary/10 text-primary h-10 min-w-60 cursor-pointer rounded-lg bg-white px-4 font-semibold tracking-widest uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:text-white"
          >
            Xem thêm
          </Button>
        </Link>
      </div>
    </>
  );
}
