import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock3, Package2, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthUser } from "@/lib/server/server-auth";
import type { User, UserPostingQuota } from "@/types";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getServerAuthUser>>>;
type PackageOrder = NonNullable<User["packageOrders"]>[number];
type BoostOrder = NonNullable<User["boostOrders"]>[number];
type ExpressOrder = NonNullable<User["expressOrders"]>[number];

function formatCurrency(amount: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string | Date | undefined | null) {
  if (!value) return "Chưa cập nhật";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function OrderEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-hairline bg-subtle/40 rounded-2xl border border-dashed px-4 py-5 text-sm">
      <p className="text-heading font-medium">{title}</p>
      <p className="text-secondary mt-1">{description}</p>
    </div>
  );
}

function QuotaCard({ quota }: { quota?: UserPostingQuota | null }) {
  const remaining = quota?.freePropertyPostsRemaining ?? 0;
  const total = quota?.freePropertyPostsTotal ?? 0;
  const used = Math.max(total - remaining, 0);
  const statusVariant =
    remaining > 1 ? "success" : remaining === 1 ? "warning" : "destructive";

  return (
    <Card className="surface-panel gap-0">
      <CardHeader className="border-hairline border-b">
        <CardTitle className="flex items-center gap-2">
          <BadgeCheck className="text-primary size-5" />
          Lượt đăng tin cho thuê miễn phí
        </CardTitle>
        <CardDescription>
          Hệ thống đã trừ tự động khi bạn đăng tin cho thuê bằng gói free.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border-hairline bg-surface rounded-2xl border p-4">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Còn lại
            </p>
            <p className="text-heading mt-2 text-xl font-semibold">
              {remaining}
            </p>
          </div>
          <div className="border-hairline bg-surface rounded-2xl border p-4">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Đã dùng
            </p>
            <p className="text-heading mt-2 text-xl font-semibold">{used}</p>
          </div>
          <div className="border-hairline bg-surface rounded-2xl border p-4">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Tổng lượt
            </p>
            <p className="text-heading mt-2 text-xl font-semibold">{total}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusVariant}>{remaining} lượt còn lại</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSection<
  T extends {
    id: number;
    status: string;
    createdAt: string | Date;
    amount: number;
    currency: string;
  },
>({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  items,
  renderItem,
}: {
  title: string;
  description: string;
  icon: typeof Package2;
  emptyTitle: string;
  emptyDescription: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <Card className="surface-panel gap-0">
      <CardHeader className="border-hairline border-b">
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-primary size-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {items.length ? (
          items.map((item) => renderItem(item))
        ) : (
          <OrderEmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </CardContent>
    </Card>
  );
}

function OrderRow({
  title,
  badges,
  details,
  footer,
}: {
  title: string;
  badges: Array<{
    label: string;
    variant?:
      | "default"
      | "secondary"
      | "outline"
      | "success"
      | "warning"
      | "destructive"
      | "muted";
  }>;
  details: Array<{ label: string; value: string }>;
  footer?: string;
}) {
  return (
    <div className="border-hairline bg-surface rounded-2xl border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-heading truncate font-medium">{title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.label} variant={badge.variant ?? "outline"}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </div>
        {footer ? <p className="text-secondary text-sm">{footer}</p> : null}
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-secondary text-xs tracking-[0.14em] uppercase">
              {item.label}
            </dt>
            <dd className="text-heading mt-1 text-sm font-medium">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default async function UserListingPackagePage() {
  const authUser = (await getServerAuthUser()) as AuthUser | null;

  if (!authUser) {
    return null;
  }

  const postingQuota = authUser.postingQuota;
  const packageOrders = (authUser.packageOrders ?? []) as PackageOrder[];
  const boostOrders = (authUser.boostOrders ?? []) as BoostOrder[];
  const expressOrders = (authUser.expressOrders ?? []) as ExpressOrder[];

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <QuotaCard quota={postingQuota} />

      {/* <div className="grid gap-6 xl:grid-cols-2">
        <OrderSection
          title="Gói đăng tin đã mua"
          description="Dữ liệu này sẽ hiển thị khi phase thanh toán/gói được kích hoạt."
          icon={Package2}
          emptyTitle="Chưa có gói đăng tin"
          emptyDescription="Khi bạn mua gói đăng tin trả phí, thông tin gói sẽ xuất hiện ở đây."
          items={packageOrders}
          renderItem={(item) => (
            <OrderRow
              key={item.id}
              title={`Gói đăng tin #${item.id}`}
              badges={[
                { label: item.priorityStatus, variant: "secondary" },
                { label: item.status, variant: "outline" },
              ]}
              details={[
                { label: "Thời hạn", value: item.duration },
                {
                  label: "Lượt còn lại",
                  value: `${item.remainingPosts}/${item.totalPosts}`,
                },
                {
                  label: "Giá trị",
                  value: formatCurrency(item.amount, item.currency),
                },
                { label: "Tạo lúc", value: formatDate(item.createdAt) },
              ]}
            />
          )}
        />

        <OrderSection
          title="Gói đẩy tin đã mua"
          description="Đẩy tin hiện chưa chạy ở phase 1, nhưng schema đã sẵn sàng."
          icon={Zap}
          emptyTitle="Chưa có gói đẩy tin"
          emptyDescription="Sau này khi mở mua boost, danh sách gói đẩy tin sẽ hiển thị tại đây."
          items={boostOrders}
          renderItem={(item) => (
            <OrderRow
              key={item.id}
              title={`Gói đẩy tin #${item.id}`}
              badges={[
                { label: item.status, variant: "outline" },
                {
                  label:
                    item.propertyId !== null && item.propertyId !== undefined
                      ? `Tin #${item.propertyId}`
                      : "Chưa gắn tin",
                  variant: item.propertyId ? "secondary" : "warning",
                },
              ]}
              details={[
                {
                  label: "Thời gian boost",
                  value: `${item.boostDurationDays} ngày`,
                },
                {
                  label: "Lượt còn lại",
                  value: `${item.remainingBoost}/${item.totalBoost}`,
                },
                {
                  label: "Giá trị",
                  value: formatCurrency(item.amount, item.currency),
                },
                { label: "Tạo lúc", value: formatDate(item.createdAt) },
              ]}
            />
          )}
        />
      </div>

      <OrderSection
        title="Gói đăng nhu cầu thuê hỏa tốc"
        description="Mục này dành cho tin cần thuê trả phí, dùng chung schema express đã có sẵn."
        icon={Clock3}
        emptyTitle="Chưa có gói hỏa tốc"
        emptyDescription="Khi phase express được bật, gói hỏa tốc sẽ hiển thị ở đây."
        items={expressOrders}
        renderItem={(item) => (
          <OrderRow
            key={item.id}
            title={`Gói hỏa tốc #${item.id}`}
            badges={[
              { label: item.status, variant: "outline" },
              { label: item.duration, variant: "warning" },
            ]}
            details={[
              {
                label: "Lượt còn lại",
                value: `${item.remainingPosts}/${item.totalPosts}`,
              },
              {
                label: "Giá trị",
                value: formatCurrency(item.amount, item.currency),
              },
              { label: "Tạo lúc", value: formatDate(item.createdAt) },
              { label: "Mã gói", value: `#${item.id}` },
            ]}
          />
        )}
      /> */}
    </section>
  );
}
