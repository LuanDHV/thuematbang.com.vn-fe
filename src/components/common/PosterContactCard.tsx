"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { useMemo } from "react";
import Image from "next/image";

type PosterContactCardProps = {
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  canRevealPhone: boolean;
};

function getMaskedPhone(phone?: string | null) {
  if (!phone) return "Đang cập nhật";
  const normalized = phone.replace(/\s+/g, "");
  if (normalized.length <= 3) return `${normalized}***`;
  return `${normalized.slice(0, 6)}***`;
}

function getInitials(name?: string | null) {
  if (!name) return "ND";
  const words = name.trim().split(/\s+/).slice(-2);
  return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

export default function PosterContactCard({
  fullName,
  phone,
  avatarUrl,
  canRevealPhone,
}: PosterContactCardProps) {
  const maskedPhone = useMemo(() => getMaskedPhone(phone), [phone]);
  const directPhone = phone || "Đang cập nhật";

  return (
    <section>
      <h2 className="text-lg font-semibold">Thông tin người đăng</h2>

      <div className="mt-3 flex items-center gap-3">
        {avatarUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={avatarUrl}
              alt={fullName || "Người đăng"}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
            {getInitials(fullName)}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">Người đăng</p>
          <p className="text-base font-semibold text-gray-900">
            {fullName || "Đang cập nhật"}
          </p>
        </div>
      </div>

      {canRevealPhone ? (
        <button className="bg-primary mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:opacity-90">
          <PhoneCall size={16} />
          Gọi {directPhone}
        </button>
      ) : (
        <Link
          href="/dang-nhap"
          className="bg-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:-translate-y-0.5 hover:opacity-90"
        >
          <PhoneCall size={16} />
          Hiện số {maskedPhone}
        </Link>
      )}
    </section>
  );
}
