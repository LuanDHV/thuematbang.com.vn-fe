"use client";

import {
  Activity,
  BadgeDollarSign,
  Building2,
  Inbox,
  Megaphone,
  Newspaper,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import AdminStatusBadge from "@/components/cms/admin/AdminStatusBadge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type HealthMetricKey =
  | "users"
  | "properties"
  | "rentRequests"
  | "leads"
  | "news"
  | "banners";

export type AdminDashboardOverviewData = {
  windowDescription: string;
  healthMetrics: Array<{
    key: HealthMetricKey;
    label: string;
    value: number;
    description: string;
  }>;
  activitySeries: Array<{
    month: string;
    properties: number;
    rentRequests: number;
    news: number;
    leads: number;
  }>;
  moduleTotals: Array<{
    module: string;
    total: number;
    fill: string;
  }>;
  propertyStatus: Array<{
    status: string;
    total: number;
    fill: string;
  }>;
  bannerStates: Array<{
    state: string;
    total: number;
    fill: string;
  }>;
  revenueDemo: {
    total: number;
    target: number;
    note: string;
    monthly: Array<{
      month: string;
      packageRevenue: number;
      boostRevenue: number;
    }>;
    paymentStates: Array<{
      label: string;
      value: string;
      tone: "success" | "warning" | "muted";
    }>;
    breakdown: Array<{
      label: string;
      amount: number;
      fill: string;
    }>;
  };
};

const activityConfig = {
  properties: {
    label: "Tin cho thuê",
    color: "var(--primary)",
  },
  rentRequests: {
    label: "Tin cần thuê",
    color: "var(--body)",
  },
  news: {
    label: "Tin tức",
    color: "var(--secondary)",
  },
  leads: {
    label: "Lead",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

const revenueConfig = {
  packageRevenue: {
    label: "Gói đăng tin",
    color: "var(--primary)",
  },
  boostRevenue: {
    label: "Boost tin",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

const propertyStatusConfig = {
  total: {
    label: "Tin cho thuê",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const bannerConfig = {
  total: {
    label: "Banner",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

const healthMetricIcons = {
  users: Users,
  properties: Building2,
  rentRequests: Inbox,
  leads: Search,
  news: Newspaper,
  banners: Megaphone,
} as const;

const moduleIcons = {
  "Cho thuê": Building2,
  "Cần thuê": Inbox,
  "Tin tức": Newspaper,
  Lead: Search,
  Banner: Megaphone,
} as const;

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function hasValues(
  rows: Array<Record<string, number | string>>,
  keys: string[],
) {
  return rows.some((row) =>
    keys.some((key) => typeof row[key] === "number" && Number(row[key]) > 0),
  );
}

function EmptyChartState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-hairline bg-app/60 flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
      <p className="text-heading text-sm font-semibold">{title}</p>
      <p className="text-secondary mt-1 max-w-xs text-xs leading-6">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboardOverview({
  data,
}: {
  data: AdminDashboardOverviewData;
}) {
  const hasActivity = hasValues(data.activitySeries, [
    "properties",
    "rentRequests",
    "news",
    "leads",
  ]);
  const hasModules = hasValues(data.moduleTotals, ["total"]);
  const hasPropertyStatus = hasValues(data.propertyStatus, ["total"]);
  const hasBannerStates = hasValues(data.bannerStates, ["total"]);
  const hasRevenue = hasValues(data.revenueDemo.monthly, [
    "packageRevenue",
    "boostRevenue",
  ]);
  const revenueTotal = data.revenueDemo.breakdown.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const revenueProgress =
    data.revenueDemo.target > 0
      ? Math.min(100, (data.revenueDemo.total / data.revenueDemo.target) * 100)
      : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        {data.healthMetrics.map((metric) => {
          const Icon = healthMetricIcons[metric.key];

          return (
            <div
              key={metric.key}
              className="surface-panel rounded-xl p-4 shadow-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-secondary text-xs font-semibold tracking-[0.14em] uppercase">
                    {metric.label}
                  </p>
                  <p className="text-heading text-2xl font-semibold">
                    {metric.value.toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="text-secondary mt-3 text-xs leading-5">
                {metric.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)]">
        <Card className="surface-panel gap-0">
          <CardHeader className="border-hairline border-b">
            <div className="space-y-1">
              <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                Activity
              </CardDescription>
              <CardTitle className="text-xl font-semibold">
                Nhịp vận hành hệ thống
              </CardTitle>
            </div>
            <CardDescription>{data.windowDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            {hasActivity ? (
              <ChartContainer
                config={activityConfig}
                className="min-h-88 w-full"
              >
                <AreaChart data={data.activitySeries}>
                  <defs>
                    <linearGradient
                      id="dashboard-properties"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-properties)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-properties)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                    <linearGradient
                      id="dashboard-rent-requests"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-rentRequests)"
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-rentRequests)"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={34}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="properties"
                    stroke="var(--color-properties)"
                    fill="url(#dashboard-properties)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="rentRequests"
                    stroke="var(--color-rentRequests)"
                    fill="url(#dashboard-rent-requests)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="news"
                    stroke="var(--color-news)"
                    fillOpacity={0}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--color-leads)"
                    fillOpacity={0}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyChartState
                title="Chưa có dữ liệu xu hướng"
                description="Biểu đồ sẽ tự hiển thị khi các module bắt đầu có bản ghi mới."
              />
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel gap-0">
          <CardHeader className="border-hairline border-b">
            <div className="space-y-1">
              <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                Revenue
              </CardDescription>
              <CardTitle className="text-xl font-semibold">
                Doanh thu demo
              </CardTitle>
            </div>
            <CardAction>
              <AdminStatusBadge tone="info">Demo payment</AdminStatusBadge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border-hairline bg-app/70 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                    <Wallet className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                      Tổng doanh thu
                    </p>
                    <p className="text-heading text-xl font-semibold">
                      {formatCurrency(data.revenueDemo.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-hairline bg-app/70 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                    <BadgeDollarSign className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                      Mục tiêu kỳ này
                    </p>
                    <p className="text-heading text-xl font-semibold">
                      {formatCurrency(data.revenueDemo.target)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-body font-medium">
                  Tiến độ đạt mục tiêu
                </span>
                <span className="text-secondary">
                  {revenueProgress.toFixed(0)}%
                </span>
              </div>
              <div className="bg-app h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${revenueProgress}%` }}
                />
              </div>
              <p className="text-secondary text-xs leading-6">
                {data.revenueDemo.note}
              </p>
            </div>

            {hasRevenue ? (
              <ChartContainer
                config={revenueConfig}
                className="min-h-60 w-full"
              >
                <BarChart data={data.revenueDemo.monthly}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={44}
                    tickFormatter={(value) =>
                      formatCompactNumber(Number(value))
                    }
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="packageRevenue"
                    stackId="revenue"
                    fill="var(--color-packageRevenue)"
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="boostRevenue"
                    stackId="revenue"
                    fill="var(--color-boostRevenue)"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChartState
                title="Chưa có dữ liệu doanh thu"
                description="Khối doanh thu demo đã sẵn sàng để nối với payment module khi backend hoàn tất."
              />
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border-hairline bg-surface space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-primary size-4" />
                  <p className="text-heading text-sm font-semibold">
                    Cơ cấu doanh thu
                  </p>
                </div>

                <div className="space-y-3">
                  {data.revenueDemo.breakdown.map((item) => {
                    const share =
                      revenueTotal > 0 ? (item.amount / revenueTotal) * 100 : 0;

                    return (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="size-2.5 rounded-full"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-body text-sm">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-secondary text-xs font-semibold">
                            {share.toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-heading text-sm font-semibold">
                          {formatCurrency(item.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-hairline bg-surface space-y-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <Wallet className="text-primary size-4" />
                  <p className="text-heading text-sm font-semibold">
                    Trạng thái thanh toán
                  </p>
                </div>

                <div className="space-y-3">
                  {data.revenueDemo.paymentStates.map((item) => (
                    <div
                      key={item.label}
                      className="border-hairline bg-app/60 flex items-center justify-between gap-3 rounded-xl border px-3 py-3"
                    >
                      <p className="text-heading text-sm font-medium">
                        {item.label}
                      </p>
                      <AdminStatusBadge tone={item.tone}>
                        {item.value}
                      </AdminStatusBadge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="surface-panel gap-0">
          <CardHeader className="border-hairline border-b">
            <div className="space-y-1">
              <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                Volume
              </CardDescription>
              <CardTitle className="text-lg font-semibold">
                Khối lượng theo module
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {hasModules ? (
              <div className="space-y-3">
                {data.moduleTotals.map((entry) => {
                  const Icon =
                    moduleIcons[entry.module as keyof typeof moduleIcons];
                  const maxValue = Math.max(
                    ...data.moduleTotals.map((item) => item.total),
                    1,
                  );
                  const ratio = (entry.total / maxValue) * 100;

                  return (
                    <div
                      key={entry.module}
                      className="border-hairline bg-surface rounded-xl border p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="border-hairline bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg border">
                            {Icon ? <Icon className="size-4" /> : null}
                          </div>
                          <div>
                            <p className="text-heading text-sm font-medium">
                              {entry.module}
                            </p>
                            <p className="text-secondary text-xs">
                              {formatCompactNumber(entry.total)} bản ghi
                            </p>
                          </div>
                        </div>
                        <p className="text-heading text-lg font-semibold">
                          {entry.total.toLocaleString("vi-VN")}
                        </p>
                      </div>
                      <div className="bg-app mt-3 h-2 overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${ratio}%`,
                            backgroundColor: entry.fill,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyChartState
                title="Chưa có số liệu module"
                description="Khi backend trả dữ liệu, khối này sẽ phản ánh quy mô từng nhóm nội dung."
              />
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel gap-0">
          <CardHeader className="border-hairline border-b">
            <div className="space-y-1">
              <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                Properties
              </CardDescription>
              <CardTitle className="text-lg font-semibold">
                Trạng thái tin cho thuê
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {hasPropertyStatus ? (
              <ChartContainer
                config={propertyStatusConfig}
                className="min-h-76 w-full"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel indicator="dot" />}
                  />
                  <Pie
                    data={data.propertyStatus}
                    dataKey="total"
                    nameKey="status"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {data.propertyStatus.map((entry) => (
                      <Cell key={entry.status} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="status" />}
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <EmptyChartState
                title="Chưa có tin cho thuê"
                description="Biểu đồ trạng thái sẽ hiển thị khi hệ thống có dữ liệu tin cho thuê."
              />
            )}
          </CardContent>
        </Card>

        <Card className="surface-panel gap-0">
          <CardHeader className="border-hairline border-b">
            <div className="space-y-1">
              <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                Banners
              </CardDescription>
              <CardTitle className="text-lg font-semibold">
                Trạng thái banner
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {hasBannerStates ? (
              <ChartContainer config={bannerConfig} className="min-h-76 w-full">
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent hideLabel indicator="dot" />}
                  />
                  <Pie
                    data={data.bannerStates}
                    dataKey="total"
                    nameKey="state"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {data.bannerStates.map((entry) => (
                      <Cell key={entry.state} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="state" />}
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <EmptyChartState
                title="Chưa có banner"
                description="Khối này đã sẵn sàng cho dữ liệu thật hoặc demo rỗng."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
