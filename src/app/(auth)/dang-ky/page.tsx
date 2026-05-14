import { SignupForm } from "@/components/auth/signup-form";
import Image from "next/image";
import Link from "next/link";

export default function DangKyPage() {
  return (
    <div className="to-primary/10 flex min-h-svh flex-col items-center justify-center bg-linear-to-b from-white p-6 md:p-10">
      <div className="w-full max-w-lg md:max-w-5xl">
        <Link
          href="/"
          className="inline-flex rounded-lg px-2 py-1 transition-opacity hover:opacity-85 lg:mb-5"
        >
          <Image
            src="/imgs/brand-logo.png"
            alt="Thuematbang.com.vn"
            width={160}
            height={80}
            className="h-14 w-28 object-contain md:h-20 md:w-40"
          />
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
