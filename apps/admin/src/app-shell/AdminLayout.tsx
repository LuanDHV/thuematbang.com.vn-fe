import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Badge,
  Empty,
  Divider,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  adminResources,
  findResourceByPath,
  menuGroups,
  type AdminMenuGroupKey,
} from "../resources";
import { axiosInstance } from "../providers/auth/auth-client";

const { Header, Sider, Content } = Layout;

type NotificationDetailItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  status?: string | null;
  createdAt: string;
  href?: string;
};

type NotificationGroup = {
  key: string;
  label: string;
  count: number;
  href: string;
  items?: NotificationDetailItem[];
};

type NotificationResponse = {
  total: number;
  items: NotificationGroup[];
};

function formatNotificationDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("vi-VN");
}

function buildMenuItems(): MenuProps["items"] {
  const resourceMap = new Map(adminResources.map((r) => [r.name, r]));
  return menuGroups.map((group) => ({
    key: group.key,
    icon: group.icon,
    label: (
      <div className="admin-sidebar-group">
        <span className="admin-sidebar-group-title">{group.label}</span>
      </div>
    ),
    children: group.items
      .map((name) => resourceMap.get(name))
      .filter(Boolean)
      .map((r) => ({
        key: r!.name,
        icon: r!.meta.icon,
        label: <Link to={r!.list}>{r!.meta.label}</Link>,
      })),
  }));
}

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<{
    name: string;
    avatar?: string;
  }>();
  const location = useLocation();
  const currentResource = React.useMemo(
    () => findResourceByPath(location.pathname),
    [location.pathname]
  );
  const isFormRoute = React.useMemo(
    () => /\/(create|edit)(\/|$)/.test(location.pathname),
    [location.pathname]
  );
  const rootMenuKeys = React.useMemo<AdminMenuGroupKey[]>(
    () => menuGroups.map((group) => group.key),
    []
  );

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => logout(),
      danger: true,
    },
  ];

  React.useEffect(() => {
    setOpenKeys(
      !collapsed && currentResource ? [currentResource.meta.group] : []
    );
  }, [collapsed, currentResource]);

  const selectedKeys = currentResource ? [currentResource.name] : [];
  const notifications = useQuery({
    queryKey: ["admin-dashboard-notifications"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<NotificationResponse>(
        "/admin/dashboard/notifications"
      );
      return data;
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  React.useEffect(() => {
    const handleDataChanged = () => {
      void queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-notifications"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin-dashboard-summary"],
      });
    };

    window.addEventListener("admin-data-changed", handleDataChanged);
    return () => {
      window.removeEventListener("admin-data-changed", handleDataChanged);
    };
  }, [queryClient]);

  React.useEffect(() => {
    void notifications.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const notificationGroups =
    notifications.data?.items?.filter(
      (item) => item.count > 0 || (item.items?.length ?? 0) > 0
    ) ?? [];

  const openNotificationTarget = (href?: string) => {
    if (!href) return;
    setNotificationOpen(false);
    navigate(href);
  };

  const notificationPanel = (
    <div
      style={{
        width: 420,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: 520,
        overflowY: "auto",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "4px 4px 10px",
        }}
      >
        <strong>Thông báo vận hành</strong>
        <Badge
          count={notifications.data?.total ?? 0}
          overflowCount={99}
          size="small"
        />
      </div>

      {notificationGroups.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thông báo"
          style={{ margin: "24px 0" }}
        />
      ) : (
        notificationGroups.map((group, groupIndex) => (
          <div key={group.key}>
            {groupIndex > 0 ? <Divider style={{ margin: "10px 0" }} /> : null}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <button
                type="button"
                onClick={() => openNotificationTarget(group.href)}
                style={{
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  color: "#1d4ed8",
                  cursor: "pointer",
                  fontWeight: 600,
                  textAlign: "left",
                }}
              >
                {group.label}
              </button>
              <Badge count={group.count} size="small" />
            </div>

            {(group.items ?? []).length > 0 ? (
              <div style={{ display: "grid", gap: 6 }}>
                {(group.items ?? []).map((item) => (
                  <button
                    key={`${group.key}-${item.id}`}
                    type="button"
                    onClick={() => openNotificationTarget(item.href ?? group.href)}
                    style={{
                      display: "grid",
                      gap: 3,
                      width: "100%",
                      border: "1px solid #eef2f7",
                      borderRadius: 8,
                      background: "#f8fafc",
                      padding: "9px 10px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        color: "#1f2937",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 8,
                        color: "#64748b",
                        fontSize: 12,
                      }}
                    >
                      <span>{item.subtitle ?? item.status ?? ""}</span>
                      <span>{formatNotificationDate(item.createdAt)}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openNotificationTarget(group.href)}
                style={{
                  width: "100%",
                  border: "1px dashed #d9e2ec",
                  borderRadius: 8,
                  background: "#fff",
                  padding: "10px 12px",
                  color: "#64748b",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Xem danh sách {group.count} mục
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );

  const handleOpenChange: MenuProps["onOpenChange"] = (nextOpenKeys) => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }

    const latestOpenKey = nextOpenKeys.find(
      (key) =>
        !openKeys.includes(key) &&
        rootMenuKeys.includes(key as AdminMenuGroupKey)
    );

    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
      return;
    }

    setOpenKeys(
      nextOpenKeys.filter((key) =>
        rootMenuKeys.includes(key as AdminMenuGroupKey)
      )
    );
  };

  return (
    <Layout
      className={
        isFormRoute ? "admin-shell admin-shell--form-page" : "admin-shell"
      }
    >
      <Sider
        className="admin-sidebar"
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={84}
        width={280}
      >
        <div className="admin-sidebar-inner">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-brand-mark">
              <AppstoreOutlined />
            </div>
            {collapsed ? null : (
              <div className="admin-sidebar-brand-copy">
                <span className="admin-sidebar-brand-title">TMB Portal</span>
                <span className="admin-sidebar-brand-subtitle">
                  Quản trị vận hành hệ thống
                </span>
              </div>
            )}
          </div>
          <Menu
            className="admin-sidebar-menu"
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={handleOpenChange}
            inlineCollapsed={collapsed}
            items={buildMenuItems()}
          />
        </div>
      </Sider>
      <Layout>
        <Header className="admin-topbar">
          <div className="admin-topbar-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Mở sidebar" : "Thu sidebar"}
            />
          </div>

          <div className="admin-topbar-right">
            <Dropdown
              open={notificationOpen}
              onOpenChange={(open) => {
                setNotificationOpen(open);
                if (open) {
                  void notifications.refetch();
                }
              }}
              menu={{ items: [] }}
              popupRender={() => notificationPanel}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={
                  <Badge
                    count={notifications.data?.total ?? 0}
                    size="small"
                    overflowCount={99}
                  >
                    <BellOutlined />
                  </Badge>
                }
                aria-label="Thông báo vận hành"
              />
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <button type="button" className="admin-topbar-user-button">
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  src={identity?.avatar}
                />
                <span className="admin-topbar-user-name">
                  {identity?.name ?? "Admin"}
                </span>
              </button>
            </Dropdown>
          </div>
        </Header>
        <Content className="admin-main">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
