import AdminDashboardOverview, {
  type AdminDashboardOverviewData,
} from "@/components/cms/admin/AdminDashboardOverview";
import type { Banner } from "@/types/banner";
import type { Lead } from "@/types/lead";
import type { News } from "@/types/news";
import type { Property } from "@/types/property";
import type { RentRequest } from "@/types/rent-request";
import type { User } from "@/types/user";
import { bannersService } from "@/services/banners.service";
import { leadService } from "@/services/lead.service";
import { newsService } from "@/services/news.service";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";
import { userService } from "@/services/user.service";

type ListResult<T> = {
  data: T[];
  meta?: {
    total?: number;
  };
};

type MonthlyKey = "properties" | "rentRequests" | "news" | "leads";

function emptyListResult<T>(): ListResult<T> {
  return { data: [] };
}

function resolveTotal<T>(result: ListResult<T>) {
  return result.meta?.total ?? result.data.length;
}

function toDate(value?: Date | string | null) {
  if (!value) return null;

  const nextDate = value instanceof Date ? value : new Date(value);
  return Number.isNaN(nextDate.getTime()) ? null : nextDate;
}

function buildRecentMonthSeries<T extends { createdAt: Date | string }>(
  items: T[],
  key: MonthlyKey,
  base: Array<{
    key: string;
    month: string;
    properties: number;
    rentRequests: number;
    news: number;
    leads: number;
  }>,
) {
  const monthMap = new Map(base.map((item) => [item.key, item]));

  for (const item of items) {
    const createdAt = toDate(item.createdAt);
    if (!createdAt) continue;

    const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const target = monthMap.get(monthKey);
    if (!target) continue;
    target[key] += 1;
  }

  return base;
}

function buildActivitySeries(args: {
  properties: Property[];
  rentRequests: RentRequest[];
  news: News[];
  leads: Lead[];
}) {
  const now = new Date();
  const base = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: `T${date.getMonth() + 1}`,
      properties: 0,
      rentRequests: 0,
      news: 0,
      leads: 0,
    };
  });

  buildRecentMonthSeries(args.properties, "properties", base);
  buildRecentMonthSeries(args.rentRequests, "rentRequests", base);
  buildRecentMonthSeries(args.news, "news", base);
  buildRecentMonthSeries(args.leads, "leads", base);

  return base;
}

function buildRevenueDemoData() {
  const monthly = [
    { month: "T1", packageRevenue: 24_000_000, boostRevenue: 8_000_000 },
    { month: "T2", packageRevenue: 28_000_000, boostRevenue: 10_000_000 },
    { month: "T3", packageRevenue: 32_000_000, boostRevenue: 11_500_000 },
    { month: "T4", packageRevenue: 35_000_000, boostRevenue: 13_000_000 },
    { month: "T5", packageRevenue: 39_000_000, boostRevenue: 15_500_000 },
    { month: "T6", packageRevenue: 42_000_000, boostRevenue: 18_000_000 },
  ];

  const packageTotal = monthly.reduce(
    (sum, item) => sum + item.packageRevenue,
    0,
  );
  const boostTotal = monthly.reduce((sum, item) => sum + item.boostRevenue, 0);
  const total = packageTotal + boostTotal;

  return {
    total,
    target: 320_000_000,
    note: "Khối doanh thu đang là demo UI, mô phỏng dữ liệu từ gói đăng tin, boost tin và trạng thái payment để chuẩn bị nối payment module.",
    monthly,
    paymentStates: [
      {
        label: "Đã thanh toán",
        value: "252.5M",
        tone: "success" as const,
      },
      {
        label: "Chờ xác nhận",
        value: "19.0M",
        tone: "warning" as const,
      },
      {
        label: "Hoàn tiền / hủy",
        value: "3.2M",
        tone: "muted" as const,
      },
    ],
    breakdown: [
      {
        label: "Gói đăng tin",
        amount: packageTotal,
        fill: "var(--admin-info-text)",
      },
      {
        label: "Boost tin",
        amount: boostTotal,
        fill: "var(--secondary)",
      },
    ],
  };
}

function buildOverviewData(args: {
  properties: ListResult<Property>;
  rentRequests: ListResult<RentRequest>;
  news: ListResult<News>;
  banners: ListResult<Banner>;
  leads: ListResult<Lead>;
  users: ListResult<User>;
}): AdminDashboardOverviewData {
  const totalUsers = resolveTotal(args.users);
  const totalProperties = resolveTotal(args.properties);
  const totalRentRequests = resolveTotal(args.rentRequests);
  const totalNews = resolveTotal(args.news);
  const totalBanners = resolveTotal(args.banners);
  const totalLeads = resolveTotal(args.leads);

  const propertyStatus = [
    {
      status: "Đã đăng",
      total: args.properties.data.filter((item) => item.status === "PUBLISHED")
        .length,
      fill: "var(--admin-success-text)",
    },
    {
      status: "Nháp",
      total: args.properties.data.filter((item) => item.status === "DRAFT")
        .length,
      fill: "var(--admin-warning-text)",
    },
    {
      status: "Lưu trữ",
      total: args.properties.data.filter((item) => item.status === "ARCHIVED")
        .length,
      fill: "var(--muted)",
    },
  ];

  const activeBanners = args.banners.data.filter(
    (item) => item.isActive,
  ).length;
  const bannerStates = [
    {
      state: "Đang bật",
      total: activeBanners,
      fill: "var(--admin-success-text)",
    },
    {
      state: "Đang tắt",
      total: args.banners.data.filter((item) => !item.isActive).length,
      fill: "var(--muted)",
    },
  ];

  return {
    windowDescription: `Tổng hợp từ ${args.properties.data.length} tin cho thuê, ${args.rentRequests.data.length} tin cần thuê, ${args.news.data.length} bài viết và ${args.leads.data.length} lead gần nhất.`,
    healthMetrics: [
      {
        key: "users",
        label: "Tổng user",
        value: totalUsers,
        description: "Tài khoản trong hệ thống",
      },
      {
        key: "properties",
        label: "Tổng tin cho thuê",
        value: totalProperties,
        description: "Nguồn cung mặt bằng",
      },
      {
        key: "rentRequests",
        label: "Tổng tin cần thuê",
        value: totalRentRequests,
        description: "Nhu cầu thuê từ khách",
      },
      {
        key: "leads",
        label: "Tổng lead",
        value: totalLeads,
        description: "Dữ liệu khách hàng tiềm năng",
      },
      {
        key: "news",
        label: "Bài viết",
        value: totalNews,
        description: "Nội dung tin tức và SEO",
      },
      {
        key: "banners",
        label: "Banner đang bật",
        value: activeBanners,
        description: `${totalBanners.toLocaleString("vi-VN")} banner tổng cộng`,
      },
    ],
    activitySeries: buildActivitySeries({
      properties: args.properties.data,
      rentRequests: args.rentRequests.data,
      news: args.news.data,
      leads: args.leads.data,
    }),
    moduleTotals: [
      {
        module: "Cho thuê",
        total: totalProperties,
        fill: "var(--admin-info-text)",
      },
      {
        module: "Cần thuê",
        total: totalRentRequests,
        fill: "var(--body)",
      },
      {
        module: "Tin tức",
        total: totalNews,
        fill: "var(--secondary)",
      },
      {
        module: "Lead",
        total: totalLeads,
        fill: "var(--admin-warning-text)",
      },
      {
        module: "Banner",
        total: totalBanners,
        fill: "var(--muted)",
      },
    ],
    propertyStatus,
    bannerStates,
    revenueDemo: buildRevenueDemoData(),
  };
}

export default async function AdminDashboardPage() {
  const [
    propertyOverviewResult,
    rentRequestOverviewResult,
    newsOverviewResult,
    bannersOverviewResult,
    leadsOverviewResult,
    usersOverviewResult,
  ] = await Promise.all([
    propertyService
      .getAll({
        page: 1,
        limit: 48,
        filters: {
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      })
      .catch(() => emptyListResult<Property>()),
    rentRequestService
      .getAll({
        page: 1,
        limit: 36,
        filters: {
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      })
      .catch(() => emptyListResult<RentRequest>()),
    newsService
      .getAll({
        page: 1,
        limit: 24,
        filters: {
          sortBy: "createdAt",
          sortOrder: "desc",
        },
      })
      .catch(() => emptyListResult<News>()),
    bannersService
      .getAll({
        page: 1,
        limit: 24,
      })
      .catch(() => emptyListResult<Banner>()),
    leadService
      .getAll({
        page: 1,
        limit: 36,
      })
      .catch(() => emptyListResult<Lead>()),
    userService
      .getAdminUsers({
        page: 1,
        limit: 24,
      })
      .catch(() => emptyListResult<User>()),
  ]);

  const overviewData = buildOverviewData({
    properties: propertyOverviewResult,
    rentRequests: rentRequestOverviewResult,
    news: newsOverviewResult,
    banners: bannersOverviewResult,
    leads: leadsOverviewResult,
    users: usersOverviewResult,
  });

  return (
    <section className="layout-section-sm space-y-6">
      <div className="space-y-2">
        <p className="text-secondary text-xs font-semibold tracking-[0.24em] uppercase">
          Dashboard
        </p>
        <h1 className="text-heading text-xl font-semibold md:text-2xl">
          Bảng điều khiển quản trị
        </h1>
        <p className="text-secondary max-w-3xl text-sm leading-7 md:text-base">
          Tổng quan vận hành CMS theo các module hiện có trong hệ thống. Phần
          doanh thu đang là demo UI để chuẩn bị nối với payment module sau.
        </p>
      </div>

      <AdminDashboardOverview data={overviewData} />
    </section>
  );
}
