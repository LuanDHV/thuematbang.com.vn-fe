"use client";

import Link from "next/link";
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

export default function AdminLeadOverviewCards({
  lead,
  sourceCardLabel,
  sourceListing,
  sourceListingHref,
  updating,
  onStatusChange,
}: AdminLeadOverviewCardsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr_1.15fr]">
      <section className="surface-panel border-hairline rounded-2xl border p-5">
        <p className="text-secondary mb-3 text-xs font-semibold uppercase">
          Thông tin liên hệ
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-secondary text-xs">ID lead</p>
            <p className="text-heading mt-1 text-sm font-medium">#{lead.id}</p>
          </div>
          <div>
            <p className="text-secondary text-xs">Họ và tên</p>
            <p className="text-heading mt-1 text-base font-semibold">
              {lead.fullName}
            </p>
          </div>
          <div>
            <p className="text-secondary text-xs">Số điện thoại</p>
            <p className="text-heading mt-1 text-base font-semibold">
              {lead.phone}
            </p>
          </div>
          <div>
            <p className="text-secondary text-xs">Ngày tạo</p>
            <p className="text-heading mt-1 text-sm font-medium">
              {formatDate(lead.createdAt, "Chưa cập nhật")}
            </p>
          </div>
        </div>
      </section>

      <section className="surface-panel border-hairline rounded-2xl border p-5">
        <p className="text-secondary mb-3 text-xs font-semibold uppercase">
          Trạng thái xử lý
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AdminStatusBadge tone={leadStatusBadgeToneMap[lead.status]}>
              {LEAD_STATUS_LABEL_MAP[lead.status]}
            </AdminStatusBadge>
          </div>
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
        </div>
      </section>

      <section className="surface-panel border-hairline rounded-2xl border p-5">
        <p className="text-secondary mb-3 text-xs font-semibold uppercase">
          {sourceCardLabel}
        </p>
        {sourceListing ? (
          <div className="space-y-3">
            {sourceListingHref ? (
              <Link
                href={sourceListingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body hover:text-primary inline-flex items-center gap-1 text-base font-semibold hover:underline"
              >
                <span className="min-w-0 flex-1">{sourceListing.title}</span>
              </Link>
            ) : (
              <p className="text-heading text-base font-semibold">
                {sourceListing.title}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <p className="text-secondary text-xs">ID</p>
                <p className="text-heading mt-1 text-sm font-medium">
                  #{sourceListing.id}
                </p>
              </div>
              <div>
                <p className="text-secondary text-xs">Họ và tên</p>
                <p className="text-heading mt-1 text-base font-semibold">
                  {sourceListing.contactName}
                </p>
              </div>
              <div>
                <p className="text-secondary text-xs">Số điện thoại</p>
                <p className="text-heading mt-1 text-base font-semibold">
                  {sourceListing.contactPhone}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-secondary text-sm">
            Không có dữ liệu listing gốc.
          </p>
        )}
      </section>
    </div>
  );
}
