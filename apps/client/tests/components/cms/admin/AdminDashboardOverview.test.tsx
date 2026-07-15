import { render, screen } from "@testing-library/react";
import AdminDashboardOverview, {
  type AdminDashboardOverviewData,
} from "@/components/cms/admin/AdminDashboardOverview";

function createEmptyDashboardData(): AdminDashboardOverviewData {
  return {
    windowDescription: "Báo cáo 30 ngày gần nhất",
    healthMetrics: [
      {
        key: "users",
        label: "Tài khoản",
        value: 0,
        description: "Tổng số tài khoản",
      },
      {
        key: "properties",
        label: "Tin cho thuê",
        value: 0,
        description: "Tổng số tin cho thuê",
      },
      {
        key: "rentRequests",
        label: "Tin cần thuê",
        value: 0,
        description: "Tổng số tin cần thuê",
      },
      {
        key: "leads",
        label: "Leads",
        value: 0,
        description: "Tổng số lead",
      },
      {
        key: "news",
        label: "Tin tức",
        value: 0,
        description: "Tổng số tin tức",
      },
      {
        key: "banners",
        label: "Banners",
        value: 0,
        description: "Tổng số banner",
      },
    ],
    activitySeries: [],
    moduleTotals: [],
    propertyStatus: [],
    bannerStates: [],
    revenueDemo: {
      total: 0,
      target: 0,
      note: "Dữ liệu demo đang chờ backend.",
      monthly: [],
      paymentStates: [],
      breakdown: [],
    },
  };
}

describe("AdminDashboardOverview", () => {
  it("renders the empty dashboard states when there is no trend data", () => {
    render(<AdminDashboardOverview data={createEmptyDashboardData()} />);

    expect(screen.getByText("Chưa có dữ liệu xu hướng")).toBeInTheDocument();
    expect(screen.getByText("Chưa có dữ liệu doanh thu")).toBeInTheDocument();
    expect(screen.getByText("Chưa có số liệu module")).toBeInTheDocument();
    expect(screen.getByText("Chưa có tin cho thuê")).toBeInTheDocument();
    expect(screen.getByText("Chưa có banner")).toBeInTheDocument();
  });

  it("renders populated dashboard widgets and charts when data exists", () => {
    render(
      <AdminDashboardOverview
        data={{
          windowDescription: "Báo cáo 30 ngày gần nhất",
          healthMetrics: [
            {
              key: "users",
              label: "Tài khoản",
              value: 128,
              description: "Tổng số tài khoản",
            },
            {
              key: "properties",
              label: "Tin cho thuê",
              value: 64,
              description: "Tổng số tin cho thuê",
            },
            {
              key: "rentRequests",
              label: "Tin cần thuê",
              value: 36,
              description: "Tổng số tin cần thuê",
            },
            {
              key: "leads",
              label: "Leads",
              value: 17,
              description: "Tổng số lead",
            },
            {
              key: "news",
              label: "Tin tức",
              value: 12,
              description: "Tổng số tin tức",
            },
            {
              key: "banners",
              label: "Banners",
              value: 5,
              description: "Tổng số banner",
            },
          ],
          activitySeries: [
            {
              month: "Tháng 5",
              properties: 12,
              rentRequests: 8,
              news: 4,
              leads: 3,
            },
            {
              month: "Tháng 6",
              properties: 16,
              rentRequests: 10,
              news: 5,
              leads: 4,
            },
          ],
          moduleTotals: [
            { module: "Cho thuê", total: 18, fill: "#1f6feb" },
            { module: "Cần thuê", total: 11, fill: "#f97316" },
          ],
          propertyStatus: [
            { status: "Published", total: 42, fill: "#1f6feb" },
            { status: "Draft", total: 22, fill: "#94a3b8" },
          ],
          bannerStates: [
            { state: "Active", total: 4, fill: "#1f6feb" },
            { state: "Inactive", total: 1, fill: "#94a3b8" },
          ],
          revenueDemo: {
            total: 12500000,
            target: 20000000,
            note: "Mục tiêu doanh thu đang tiến gần.",
            monthly: [
              {
                month: "Tháng 5",
                packageRevenue: 2500000,
                boostRevenue: 1000000,
              },
              {
                month: "Tháng 6",
                packageRevenue: 3500000,
                boostRevenue: 1500000,
              },
            ],
            paymentStates: [
              { label: "Hoàn tất", value: "18", tone: "success" },
              { label: "Chờ xử lý", value: "3", tone: "warning" },
            ],
            breakdown: [
              { label: "Gói đăng tin", amount: 9000000, fill: "#1f6feb" },
              { label: "Boost tin", amount: 3500000, fill: "#f97316" },
            ],
          },
        }}
      />,
    );

    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("64")).toBeInTheDocument();
    expect(screen.getByText("Tiến độ đạt mục tiêu")).toBeInTheDocument();
    expect(screen.getByText("Hoàn tất")).toBeInTheDocument();
    expect(screen.getByText("Chờ xử lý")).toBeInTheDocument();
  });
});
