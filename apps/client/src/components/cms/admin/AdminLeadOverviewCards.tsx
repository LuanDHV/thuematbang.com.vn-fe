"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import AdminStatusBadge, {
  leadStatusBadgeToneMap,
} from "@/components/cms/admin/AdminStatusBadge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEAD_STATUS_LABEL_MAP,
  LEAD_STATUS_OPTIONS,
} from "@/constants/enum-options";
import { formatDate } from "@/lib/format";
import type { Lead } from "@/types/lead";
import type { LeadStatus } from "@/types/enums";

type SourceListingSummary =
  | {
      id: number;
      title: string;
      slug?: string | null;
      contactName: string;
      contactPhone: string;
    }
  | null
  | undefined;

type AdminLeadOverviewCardsProps = {
  lead: Lead;
  sourceCardLabel: string;
  sourceListing: SourceListingSummary;
  sourceListingHref: string | null;
  updating: boolean;
  onStatusChange: (status: LeadStatus) => void;
};

function DetailTile({
  label,
  value,
  valueClassName = "text-sm font-medium",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="border-hairline bg-app/55 rounded-xl border px-3 py-3">
      <p className="text-secondary text-[11px] font-semibold tracking-[0.18em] uppercase">
        {label}
      </p>
      <div className={`text-heading mt-2 wrap-break-word ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}

export default function AdminLeadOverviewCards({
  lead,
  sourceCardLabel,
  sourceListing,
  sourceListingHref,
  updating,
  onStatusChange,
}: AdminLeadOverviewCardsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.92fr_1.03fr]">
      <section className="surface-panel border-hairline overflow-hidden rounded-2xl border">
        <div className="border-hairline flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="space-y-1">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Thông tin lead
            </p>
            <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
              {lead.fullName}
            </h2>
            <p className="text-secondary text-sm">Lead #{lead.id}</p>
          </div>
          <AdminStatusBadge tone={leadStatusBadgeToneMap[lead.status]}>
            {LEAD_STATUS_LABEL_MAP[lead.status]}
          </AdminStatusBadge>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <DetailTile label="Số điện thoại" value={lead.phone} />
          <DetailTile
            label="Ngày tạo"
            value={formatDate(lead.createdAt, "Chưa cập nhật")}
          />
          <DetailTile label="ID lead" value={`#${lead.id}`} />
          <DetailTile
            label="Trạng thái"
            value={LEAD_STATUS_LABEL_MAP[lead.status]}
            valueClassName="text-base font-semibold"
          />
        </div>
      </section>

      <section className="surface-panel border-hairline overflow-hidden rounded-2xl border">
        <div className="border-hairline flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="space-y-1">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Trạng thái xử lý
            </p>
            <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
              Kiểm soát vòng đời lead
            </h2>
          </div>
          <AdminStatusBadge tone={leadStatusBadgeToneMap[lead.status]}>
            {LEAD_STATUS_LABEL_MAP[lead.status]}
          </AdminStatusBadge>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <Label className="text-secondary text-xs">Đổi trạng thái</Label>
            <Select
              value={lead.status}
              onValueChange={(value) => onStatusChange(value as LeadStatus)}
              disabled={updating}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-secondary text-sm leading-6">
            Chỉ giữ một điểm hành động chính tại đây để thao tác nhanh và tránh
            phân tán trạng thái.
          </p>
        </div>
      </section>

      <section className="surface-panel border-hairline overflow-hidden rounded-2xl border">
        <div className="border-hairline flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="space-y-1">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              {sourceCardLabel}
            </p>
            <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
              Tin gốc
            </h2>
          </div>
        </div>

        {sourceListing ? (
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              {sourceListingHref ? (
                <Link
                  href={sourceListingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body hover:text-primary inline-flex items-start gap-1 text-base leading-6 font-semibold hover:underline"
                >
                  <span className="min-w-0 flex-1 wrap-break-word">
                    {sourceListing.title}
                  </span>
                </Link>
              ) : (
                <p className="text-heading text-base leading-6 font-semibold">
                  {sourceListing.title}
                </p>
              )}
              <p className="text-secondary text-sm">
                Thông tin liên hệ được gom lại thành một cụm ngắn để dễ quét.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTile label="ID" value={`#${sourceListing.id}`} />
              <DetailTile
                label="Người liên hệ"
                value={sourceListing.contactName}
              />
              <DetailTile
                label="Điện thoại"
                value={sourceListing.contactPhone}
                valueClassName="text-base font-semibold"
              />
            </div>
          </div>
        ) : (
          <div className="px-5 py-6">
            <p className="text-secondary text-sm">
              Không có dữ liệu listing gốc.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
