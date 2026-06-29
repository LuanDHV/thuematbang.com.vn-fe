"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { useMemo } from "react";
import CloudinaryImage from "@/components/common/CloudinaryImage";

type PosterContactCardProps = {
  fullName?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  canRevealPhone: boolean;
  loginHref?: string;
  revealLabelPrefix?: string;
  maskedLabelPrefix?: string;
};

function normalizePhone(phone?: string | null) {
  if (!phone) return "";
  return phone.replace(/\s+/g, "");
}

function getMaskedPhone(phone?: string | null) {
  const normalized = normalizePhone(phone);
  if (!normalized) return "Đang cập nhật";
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
  loginHref = "/dang-nhap",
  revealLabelPrefix = "Liên hệ",
  maskedLabelPrefix = "Hiện số",
}: PosterContactCardProps) {
  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const maskedPhone = useMemo(() => getMaskedPhone(phone), [phone]);
  const directPhone = normalizedPhone || "Đang cập nhật";

  return (
    <section>
      <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
        Thông tin người đăng
      </h2>

      <div className="mt-4 flex items-center gap-3">
        {avatarUrl ? (
          <div className="ring-hairline relative h-12 w-12 overflow-hidden rounded-full ring-1">
            <CloudinaryImage
              src={avatarUrl}
              alt={fullName || "Người đăng"}
              fill
              sizes="48px"
              cldQuality="auto:good"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-accent-soft text-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
            {getInitials(fullName)}
          </div>
        )}
        <div>
          <p className="text-secondary text-sm">Người đăng</p>
          <p className="text-heading text-base font-semibold">
            {fullName || "Đang cập nhật"}
          </p>
        </div>
      </div>

      {canRevealPhone ? (
        <a
          href={normalizedPhone ? `tel:${normalizedPhone}` : undefined}
          className="bg-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-card) transition-[filter] hover:brightness-[1.02]"
        >
          <PhoneCall size={16} />
          {revealLabelPrefix} {directPhone}
        </a>
      ) : (
        <Link
          href={loginHref}
          className="bg-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-card) transition-[filter] hover:brightness-[1.02]"
        >
          <PhoneCall size={16} />
          {maskedLabelPrefix} {maskedPhone}
        </Link>
      )}
    </section>
  );
}
