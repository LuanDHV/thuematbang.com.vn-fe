import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, Column, Line, Pie } from "@ant-design/charts";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Empty,
  List,
  Row,
  Segmented,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  HomeOutlined,
  OrderedListOutlined,
  ReloadOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { axiosInstance } from "../providers/auth/auth-client";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

type DashboardQueueItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  createdAt: string;
  href?: string;
};

type DashboardSummary = {
  range: { from: string; to: string };
  ga: { available: boolean; error?: string };
  overview: {
    websiteViews: number;
    newUsers: number;
    newProperties: number;
    newRentRequests: number;
    matches: number;
    pendingPayments: number;
    matchedDeals: number;
  };
  traffic: {
    sessions: number;
    screenPageViews: number;
    averageSessionDuration: number;
    screenPageViewsPerSession: number;
    bounceRate: number;
    byDay: Array<{ date: string; sessions: number; screenPageViews: number }>;
  };
  business: {
    properties: {
      totalNew: number;
      vip?: number;
      premium: number;
      standard: number;
      free: number;
      published: number;
      pending: number;
    };
    rentRequests: {
      totalNew: number;
      express: number;
      published: number;
      pending: number;
    };
    connections: {
      leads: number;
      matches: number;
      candidateDeals: number;
      matchedDeals: number;
    };
    payments: { pending: number };
  };
  behavior: Record<string, number>;
  charts: {
    businessByDay: Array<{
      date: string;
      properties: number;
      rentRequests: number;
      leads: number;
      users: number;
      matches: number;
    }>;
  };
  queues: {
    pendingProperties: DashboardQueueItem[];
    pendingRentRequests: DashboardQueueItem[];
    newDealCases: DashboardQueueItem[];
    pendingProposals: DashboardQueueItem[];
    pendingPayments: DashboardQueueItem[];
  };
};

type KpiSource = "GA4" | "DB";
type TrendMode = "traffic" | "business";

const DEFAULT_RANGE: [Dayjs, Dayjs] = [dayjs().subtract(6, "day"), dayjs()];

const behaviorLabels: Record<string, string> = {
  click_post_property: "Click đăng cho thuê",
  property_form_started: "Bắt đầu form cho thuê",
  property_form_submit_clicked: "Click gửi form cho thuê",
  property_form_completed: "Đăng cho thuê thành công",
  property_form_failed: "Đăng cho thuê thất bại",
  click_post_rent_request: "Click đăng cần thuê",
  rent_request_form_started: "Bắt đầu form cần thuê",
  rent_request_form_submit_clicked: "Click gửi form cần thuê",
  rent_request_form_completed: "Đăng cần thuê thành công",
  rent_request_form_failed: "Đăng cần thuê thất bại",
  click_property_listing: "Click xem tin cho thuê",
  view_property_detail: "Xem chi tiết cho thuê",
  click_rent_request_listing: "Click xem nhu cầu thuê",
  view_rent_request_detail: "Xem chi tiết cần thuê",
  click_project_listing: "Click xem dự án",
  view_project_detail: "Xem chi tiết dự án",
  click_news_listing: "Click xem tin tức",
  view_news_detail: "Xem chi tiết tin tức",
  click_contact: "Click liên hệ",
  contact_form_submit_clicked: "Click gửi liên hệ",
  contact_form_completed: "Gửi liên hệ thành công",
  contact_form_failed: "Gửi liên hệ thất bại",
  favorite_listing: "Bấm lưu tin yêu thích",
  unfavorite_listing: "Bấm bỏ lưu tin yêu thích",
  login_submit_clicked: "Click nút đăng nhập",
  login_completed: "Đăng nhập thành công",
  login_failed: "Đăng nhập thất bại",
  google_login_clicked: "Click đăng nhập bằng Google",
  register_submit_clicked: "Click nút đăng ký",
  register_completed: "Đăng ký tài khoản thành công",
  register_failed: "Đăng ký tài khoản thất bại",
  logout_clicked: "Click nút đăng xuất",
  logout_completed: "Đăng xuất thành công",
  logout_failed: "Đăng xuất thất bại",
  listing_gallery_opened: "Mở xem bộ sưu tập ảnh chi tiết",
};

function formatDate(value: Dayjs) {
  return value.format("YYYY-MM-DD");
}

function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function toNumber(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function eventValue(behavior: Record<string, number>, eventName: string) {
  return toNumber(behavior[eventName]);
}

function rate(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function toTrafficRows(summary?: DashboardSummary) {
  if (!summary) return [];
  return summary.traffic.byDay.flatMap((row) => [
    { date: row.date, type: "Phiên", value: row.sessions },
    { date: row.date, type: "Lượt xem", value: row.screenPageViews },
  ]);
}

function toBusinessRows(summary?: DashboardSummary) {
  if (!summary) return [];
  return summary.charts.businessByDay.flatMap((row) => [
    { date: row.date, type: "Tin cho thuê", value: row.properties },
    { date: row.date, type: "Nhu cầu thuê", value: row.rentRequests },
    { date: row.date, type: "Hồ sơ", value: row.leads },
    { date: row.date, type: "User", value: row.users },
    { date: row.date, type: "Đề xuất", value: row.matches },
  ]);
}

function integerAxisConfig() {
  return {
    y: {
      labelFormatter: (value: string | number) => {
        const numeric = Number(value);
        return Number.isInteger(numeric) ? String(numeric) : "";
      },
    },
  };
}

function buildConversionRows(behavior: Record<string, number>) {
  return [
    {
      flow: "Đăng cho thuê",
      stage: "Click",
      value: eventValue(behavior, "click_post_property"),
    },
    {
      flow: "Đăng cho thuê",
      stage: "Bắt đầu",
      value: eventValue(behavior, "property_form_started"),
    },
    {
      flow: "Đăng cho thuê",
      stage: "Gửi form",
      value: eventValue(behavior, "property_form_submit_clicked"),
    },
    {
      flow: "Đăng cho thuê",
      stage: "Thành công",
      value: eventValue(behavior, "property_form_completed"),
    },
    {
      flow: "Đăng cho thuê",
      stage: "Thất bại",
      value: eventValue(behavior, "property_form_failed"),
    },
    {
      flow: "Đăng cần thuê",
      stage: "Click",
      value: eventValue(behavior, "click_post_rent_request"),
    },
    {
      flow: "Đăng cần thuê",
      stage: "Bắt đầu",
      value: eventValue(behavior, "rent_request_form_started"),
    },
    {
      flow: "Đăng cần thuê",
      stage: "Gửi form",
      value: eventValue(behavior, "rent_request_form_submit_clicked"),
    },
    {
      flow: "Đăng cần thuê",
      stage: "Thành công",
      value: eventValue(behavior, "rent_request_form_completed"),
    },
    {
      flow: "Đăng cần thuê",
      stage: "Thất bại",
      value: eventValue(behavior, "rent_request_form_failed"),
    },
    {
      flow: "Liên hệ",
      stage: "Click",
      value: eventValue(behavior, "click_contact"),
    },
    {
      flow: "Liên hệ",
      stage: "Gửi form",
      value: eventValue(behavior, "contact_form_submit_clicked"),
    },
    {
      flow: "Liên hệ",
      stage: "Thành công",
      value: eventValue(behavior, "contact_form_completed"),
    },
    {
      flow: "Liên hệ",
      stage: "Thất bại",
      value: eventValue(behavior, "contact_form_failed"),
    },
  ];
}

function buildConversionSummaries(behavior: Record<string, number>) {
  const items = [
    {
      label: "Đăng cho thuê",
      click: eventValue(behavior, "click_post_property"),
      submit: eventValue(behavior, "property_form_submit_clicked"),
      completed: eventValue(behavior, "property_form_completed"),
      failed: eventValue(behavior, "property_form_failed"),
    },
    {
      label: "Đăng cần thuê",
      click: eventValue(behavior, "click_post_rent_request"),
      submit: eventValue(behavior, "rent_request_form_submit_clicked"),
      completed: eventValue(behavior, "rent_request_form_completed"),
      failed: eventValue(behavior, "rent_request_form_failed"),
    },
    {
      label: "Liên hệ",
      click: eventValue(behavior, "click_contact"),
      submit: eventValue(behavior, "contact_form_submit_clicked"),
      completed: eventValue(behavior, "contact_form_completed"),
      failed: eventValue(behavior, "contact_form_failed"),
    },
  ];

  return items.map((item) => {
    const denominator = item.submit || item.click;
    return {
      ...item,
      completionRate: rate(item.completed, denominator),
      failRate: rate(item.failed, denominator),
    };
  });
}

function buildEngagementRows(behavior: Record<string, number>) {
  return [
    {
      content: "Cho thuê",
      metric: "Click listing",
      value: eventValue(behavior, "click_property_listing"),
    },
    {
      content: "Cho thuê",
      metric: "Xem chi tiết",
      value: eventValue(behavior, "view_property_detail"),
    },
    {
      content: "Cần thuê",
      metric: "Click listing",
      value: eventValue(behavior, "click_rent_request_listing"),
    },
    {
      content: "Cần thuê",
      metric: "Xem chi tiết",
      value: eventValue(behavior, "view_rent_request_detail"),
    },
    {
      content: "Dự án",
      metric: "Click listing",
      value: eventValue(behavior, "click_project_listing"),
    },
    {
      content: "Dự án",
      metric: "Xem chi tiết",
      value: eventValue(behavior, "view_project_detail"),
    },
    {
      content: "Tin tức",
      metric: "Click listing",
      value: eventValue(behavior, "click_news_listing"),
    },
    {
      content: "Tin tức",
      metric: "Xem chi tiết",
      value: eventValue(behavior, "view_news_detail"),
    },
  ];
}

function buildAuthRows(behavior: Record<string, number>) {
  return [
    {
      flow: "Đăng nhập",
      metric: "Click",
      value: eventValue(behavior, "login_submit_clicked"),
    },
    {
      flow: "Đăng nhập",
      metric: "Thành công",
      value: eventValue(behavior, "login_completed"),
    },
    {
      flow: "Đăng nhập",
      metric: "Thất bại",
      value: eventValue(behavior, "login_failed"),
    },
    {
      flow: "Google",
      metric: "Click",
      value: eventValue(behavior, "google_login_clicked"),
    },
    {
      flow: "Đăng ký",
      metric: "Click",
      value: eventValue(behavior, "register_submit_clicked"),
    },
    {
      flow: "Đăng ký",
      metric: "Thành công",
      value: eventValue(behavior, "register_completed"),
    },
    {
      flow: "Đăng ký",
      metric: "Thất bại",
      value: eventValue(behavior, "register_failed"),
    },
    {
      flow: "Đăng xuất",
      metric: "Thành công",
      value: eventValue(behavior, "logout_completed"),
    },
    {
      flow: "Đăng xuất",
      metric: "Thất bại",
      value: eventValue(behavior, "logout_failed"),
    },
  ];
}

function SourceTag({ source }: { source: KpiSource }) {
  return <Tag color={source === "GA4" ? "blue" : "default"}>{source}</Tag>;
}

function KpiCard({
  title,
  value,
  source,
  prefix,
}: {
  title: string;
  value: number;
  source: KpiSource;
  prefix: React.ReactNode;
}) {
  return (
    <Card>
      <Statistic
        title={
          <Space size={6} wrap>
            <span>{title}</span>
            <SourceTag source={source} />
          </Space>
        }
        value={value}
        prefix={prefix}
      />
    </Card>
  );
}

function OperationChartContent({
  data,
}: {
  data: Array<{ label: string; value: number; color?: string }>;
}) {
  const normalizedData = data.map((item) => ({
    ...item,
    value: toNumber(item.value),
  }));
  const total = normalizedData.reduce((sum, item) => sum + item.value, 0);
  const chartData =
    total > 0
      ? normalizedData
      : [{ label: "Chưa có dữ liệu", value: 1, color: "#d4dbe6" }];

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} md={14}>
        <Pie
          data={chartData}
          angleField="value"
          colorField="label"
          height={240}
          innerRadius={0.62}
          legend={{ position: "bottom" }}
          label={{ text: "value", style: { fontWeight: 600 } }}
          scale={{
            color: {
              range: chartData.map((item) => item.color).filter(Boolean),
            },
          }}
        />
      </Col>
      <Col xs={24} md={10}>
        <div className="admin-stack">
          <Statistic title="Tổng hiện tại" value={total} />
          <div>
            {normalizedData.map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "6px 0",
                }}
              >
                <Text type="secondary">{item.label}</Text>
                <Text strong>{item.value}</Text>
              </div>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
}

function OperationChartCard({
  title,
  data,
  pendingHref,
  pendingLabel,
}: {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  pendingHref: string;
  pendingLabel: string;
}) {
  return (
    <Card title={title} extra={<Link to={pendingHref}>{pendingLabel}</Link>}>
      <OperationChartContent data={data} />
    </Card>
  );
}

function QueueList({
  items,
  emptyText,
}: {
  items: DashboardQueueItem[];
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
    );
  }

  return (
    <List
      dataSource={items.slice(0, 5)}
      renderItem={(item) => (
        <List.Item
          actions={item.href ? [<Link to={item.href}>Xem</Link>] : undefined}
        >
          <List.Item.Meta
            title={<Text strong>{item.title}</Text>}
            description={
              <Space size={8} wrap>
                {item.subtitle ? (
                  <Text type="secondary">{item.subtitle}</Text>
                ) : null}
                {item.status ? <Tag>{item.status}</Tag> : null}
                <Text type="secondary">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
}

function QueueTabs({ summary }: { summary: DashboardSummary }) {
  const { queues } = summary;
  const newDealCases = queues.newDealCases;
  const summaryText = `${queues.pendingProperties.length} tin cho thuê · ${queues.pendingRentRequests.length} tin cần thuê · ${newDealCases.length} hồ sơ · ${queues.pendingProposals.length} đề xuất · ${queues.pendingPayments.length} thanh toán`;

  return (
    <Card
      title="Hàng đợi cần xử lý"
      extra={<Text type="secondary">{summaryText}</Text>}
    >
      <Tabs
        items={[
          {
            key: "properties",
            label: `Tin cho thuê (${queues.pendingProperties.length})`,
            children: (
              <QueueList
                items={queues.pendingProperties}
                emptyText="Không có tin cho thuê chờ duyệt"
              />
            ),
          },
          {
            key: "rentRequests",
            label: `Tin cần thuê (${queues.pendingRentRequests.length})`,
            children: (
              <QueueList
                items={queues.pendingRentRequests}
                emptyText="Không có tin cần thuê chờ duyệt"
              />
            ),
          },
          {
            key: "leads",
            label: `Hồ sơ mới (${newDealCases.length})`,
            children: (
              <QueueList items={newDealCases} emptyText="Không có hồ sơ mới" />
            ),
          },
          {
            key: "proposals",
            label: `Đề xuất chờ duyệt (${queues.pendingProposals.length})`,
            children: (
              <QueueList
                items={queues.pendingProposals}
                emptyText="Không có đề xuất chờ duyệt"
              />
            ),
          },
          {
            key: "payments",
            label: `Thanh toán (${queues.pendingPayments.length})`,
            children: (
              <QueueList
                items={queues.pendingPayments}
                emptyText="Không có thanh toán đang xử lý"
              />
            ),
          },
        ]}
      />
    </Card>
  );
}

function ConversionChart({ behavior }: { behavior: Record<string, number> }) {
  const rows = buildConversionRows(behavior);
  const summaries = buildConversionSummaries(behavior);

  return (
    <Card title="Funnel chuyển đổi">
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Bar
            data={rows}
            xField="value"
            yField="flow"
            colorField="stage"
            height={320}
            group
            legend={{ position: "bottom" }}
          />
        </Col>
        <Col xs={24} xl={8}>
          <div className="admin-stack">
            {summaries.map((item) => (
              <Card size="small" key={item.label}>
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Text strong>{item.label}</Text>
                  <Space size={16} wrap>
                    <Statistic title="Click" value={item.click} />
                    <Statistic title="Thành công" value={item.completed} />
                    <Statistic title="Thất bại" value={item.failed} />
                  </Space>
                  <Text type="secondary">
                    Hoàn thành {item.completionRate}% · Lỗi {item.failRate}%
                  </Text>
                </Space>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Card>
  );
}

function EngagementChart({ behavior }: { behavior: Record<string, number> }) {
  return (
    <Card title="Tương tác nội dung">
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Column
            data={buildEngagementRows(behavior)}
            xField="content"
            yField="value"
            colorField="metric"
            height={300}
            group
            legend={{ position: "bottom" }}
          />
        </Col>
        <Col xs={24} xl={8}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={8} xl={24}>
              <Card size="small">
                <Statistic
                  title="Lưu tin"
                  value={eventValue(behavior, "favorite_listing")}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} xl={24}>
              <Card size="small">
                <Statistic
                  title="Bỏ lưu"
                  value={eventValue(behavior, "unfavorite_listing")}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8} xl={24}>
              <Card size="small">
                <Statistic
                  title="Mở gallery"
                  value={eventValue(behavior, "listing_gallery_opened")}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

function AuthChart({ behavior }: { behavior: Record<string, number> }) {
  return (
    <Card title="Tài khoản">
      <Column
        data={buildAuthRows(behavior)}
        xField="flow"
        yField="value"
        colorField="metric"
        height={280}
        group
        legend={{ position: "bottom" }}
      />
    </Card>
  );
}

function EventDebugTable({ behavior }: { behavior: Record<string, number> }) {
  const rows = Object.entries(behavior).map(([eventName, value]) => ({
    key: eventName,
    eventName,
    label: behaviorLabels[eventName] ?? eventName,
    value,
  }));

  return (
    <Collapse
      items={[
        {
          key: "events",
          label: "Chi tiết GA4 events",
          children: (
            <Table
              size="small"
              pagination={false}
              dataSource={rows}
              columns={[
                { title: "Event", dataIndex: "eventName" },
                { title: "Tên hiển thị", dataIndex: "label" },
                {
                  title: "Số lượng",
                  dataIndex: "value",
                  align: "right",
                  width: 120,
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}

export const DashboardPage: React.FC = () => {
  const [range, setRange] = React.useState<[Dayjs, Dayjs]>(DEFAULT_RANGE);
  const [trendMode, setTrendMode] = React.useState<TrendMode>("traffic");
  const from = formatDate(range[0]);
  const to = formatDate(range[1]);

  const summary = useQuery({
    queryKey: ["admin-dashboard-summary", from, to],
    queryFn: async () => {
      const { data } = await axiosInstance.get<DashboardSummary>(
        "/admin/dashboard/summary",
        { params: { from, to } }
      );
      return data;
    },
    staleTime: 60_000,
  });

  const handleExport = async () => {
    const { data } = await axiosInstance.get("/admin/dashboard/report", {
      params: { from, to, format: "xlsx" },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-report-${from}-${to}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const data = summary.data;
  const trendRows =
    trendMode === "traffic" ? toTrafficRows(data) : toBusinessRows(data);
  const propertyOperationStats = data
    ? [
        {
          label: "Đang hiển thị",
          value: toNumber(data.business.properties.published),
          color: "#2e7de9",
        },
        {
          label: "Chờ duyệt",
          value: toNumber(data.business.properties.pending),
          color: "#c65548",
        },
      ]
    : [];
  const rentRequestOperationRows = data
    ? [
        {
          label: "Đang hiển thị",
          value: toNumber(data.business.rentRequests.published),
          color: "#2e71b8",
        },
        {
          label: "Hỏa tốc",
          value: toNumber(data.business.rentRequests.express),
          color: "#1f8f66",
        },
        {
          label: "Chờ duyệt",
          value: toNumber(data.business.rentRequests.pending),
          color: "#c65548",
        },
      ]
    : [];
  return (
    <div className="admin-stack">
      <div className="admin-page-header admin-page-header-surface admin-panel">
        <div className="admin-page-header-main">
          <span className="admin-page-eyebrow">Dashboard</span>
          <Title className="admin-page-title" level={2}>
            Tổng quan vận hành
          </Title>
          <div className="admin-page-description">
            Theo dõi traffic, chuyển đổi GA4, hàng đợi duyệt và hiệu quả vận
            hành trong một nơi.
          </div>
        </div>
        <Space className="admin-page-actions" wrap>
          <RangePicker
            value={range}
            allowClear={false}
            onChange={(value) => {
              if (value?.[0] && value[1]) {
                setRange([value[0], value[1]]);
              }
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => summary.refetch()}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!data}
          >
            Xuất Excel
          </Button>
        </Space>
      </div>

      {summary.isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spin size="large" />
        </div>
      ) : null}

      {summary.isError ? (
        <Alert
          type="error"
          showIcon
          message="Không thể tải dashboard"
          description="Vui lòng thử làm mới hoặc kiểm tra kết nối API."
        />
      ) : null}

      {data ? (
        <>
          {!data.ga.available ? (
            <Alert
              type="warning"
              showIcon
              message="Google Analytics chưa khả dụng"
              description={
                data.ga.error ??
                "Dashboard vẫn hiển thị số liệu vận hành từ database."
              }
            />
          ) : null}

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Lượt xem website"
                value={data.overview.websiteViews}
                source="GA4"
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Sessions"
                value={data.traffic.sessions}
                source="GA4"
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="User đăng ký mới"
                value={data.overview.newUsers}
                source="DB"
                prefix={<UserOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Tin cho thuê mới"
                value={data.overview.newProperties}
                source="DB"
                prefix={<HomeOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Nhu cầu thuê mới"
                value={data.overview.newRentRequests}
                source="DB"
                prefix={<OrderedListOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Liên hệ thành công"
                value={eventValue(data.behavior, "contact_form_completed")}
                source="GA4"
                prefix={<CheckCircleOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Hồ sơ mới"
                value={data.business.connections.leads}
                source="DB"
                prefix={<SwapOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <KpiCard
                title="Đề xuất chờ duyệt"
                value={data.queues.pendingProposals.length}
                source="DB"
                prefix={<ClockCircleOutlined />}
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <Card
                title="Xu hướng theo ngày"
                extra={
                  <Segmented
                    value={trendMode}
                    onChange={(value) => setTrendMode(value as TrendMode)}
                    options={[
                      { label: "Traffic", value: "traffic" },
                      { label: "Vận hành", value: "business" },
                    ]}
                  />
                }
              >
                {trendMode === "business" ? (
                  <Column
                    data={trendRows}
                    xField="date"
                    yField="value"
                    colorField="type"
                    group
                    height={320}
                    axis={integerAxisConfig()}
                  />
                ) : (
                  <Line
                    data={trendRows}
                    xField="date"
                    yField="value"
                    colorField="type"
                    height={320}
                    point
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Card title="Chỉ số traffic">
                <div className="admin-stack">
                  <Statistic title="Sessions" value={data.traffic.sessions} />
                  <Statistic
                    title="Thời gian trung bình"
                    value={formatDuration(data.traffic.averageSessionDuration)}
                  />
                  <Statistic
                    title="Số trang/phiên"
                    value={data.traffic.screenPageViewsPerSession.toFixed(2)}
                  />
                  <Statistic
                    title="Bounce rate"
                    value={formatPercent(data.traffic.bounceRate)}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <ConversionChart behavior={data.behavior} />

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <EngagementChart behavior={data.behavior} />
            </Col>
            <Col xs={24} xl={8}>
              <AuthChart behavior={data.behavior} />
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <OperationChartCard
                title="Vận hành mặt bằng"
                data={propertyOperationStats}
                pendingHref="/properties?status=PENDING"
                pendingLabel="Xem tin chờ duyệt"
              />
            </Col>
            <Col xs={24} lg={12}>
              <OperationChartCard
                title="Vận hành khách thuê"
                data={rentRequestOperationRows}
                pendingHref="/rent-requests?status=PENDING"
                pendingLabel="Xem nhu cầu chờ duyệt"
              />
            </Col>
          </Row>

          <QueueTabs summary={data} />

          <EventDebugTable behavior={data.behavior} />
        </>
      ) : null}
    </div>
  );
};
