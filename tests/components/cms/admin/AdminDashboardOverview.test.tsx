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
});
