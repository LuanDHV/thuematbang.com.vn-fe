import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#2b5cff",
    colorInfo: "#2e71b8",
    colorSuccess: "#1f8f66",
    colorWarning: "#b96f18",
    colorError: "#c65548",
    colorBgBase: "#eef3fb",
    colorBgLayout: "#eef3fb",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "rgba(17, 25, 39, 0.08)",
    colorBorderSecondary: "rgba(17, 25, 39, 0.12)",
    colorText: "#233044",
    colorTextSecondary: "#6a7687",
    colorTextTertiary: "#8a97a9",
    colorTextQuaternary: "#a7b2c2",
    borderRadius: 14,
    borderRadiusLG: 18,
    borderRadiusSM: 10,
    fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
    boxShadow:
      "0 12px 28px rgba(15, 23, 42, 0.06)",
    boxShadowSecondary:
      "0 18px 40px rgba(15, 23, 42, 0.08)",
  },
  components: {
    Layout: {
      headerBg: "rgba(244, 247, 251, 0.84)",
      bodyBg: "transparent",
      siderBg: "#111927",
      triggerBg: "#0f1724",
      triggerColor: "#ffffff",
    },
    Menu: {
      darkItemBg: "transparent",
      darkItemColor: "rgba(255, 255, 255, 0.86)",
      darkItemHoverBg: "rgba(59, 130, 246, 0.14)",
      darkItemSelectedBg: "rgba(59, 130, 246, 0.22)",
      darkItemSelectedColor: "#ffffff",
      darkSubMenuItemBg: "transparent",
      darkGroupTitleColor: "rgba(255, 255, 255, 0.58)",
      itemBorderRadius: 12,
    },
    Card: {
      headerBg: "transparent",
      colorBorderSecondary: "rgba(17, 25, 39, 0.08)",
      paddingLG: 20,
    },
    Table: {
      headerBg: "#f6f9fd",
      headerColor: "#5f6b7c",
      borderColor: "rgba(17, 25, 39, 0.08)",
      rowHoverBg: "#f6f9ff",
      cellPaddingBlock: 12,
      cellPaddingInline: 14,
    },
    Button: {
      defaultBorderColor: "rgba(17, 25, 39, 0.12)",
      colorLink: "#2b5cff",
      colorLinkHover: "#1f4ce0",
      colorLinkActive: "#1737b3",
      primaryShadow: "0 14px 24px rgba(43, 92, 255, 0.18)",
      borderRadius: 12,
      borderRadiusSM: 10,
      controlHeight: 36,
      controlHeightSM: 32,
    },
    Input: {
      activeBorderColor: "#2b5cff",
      hoverBorderColor: "#6f8dff",
    },
    Select: {
      activeBorderColor: "#2b5cff",
      hoverBorderColor: "#6f8dff",
    },
    Dropdown: {
      paddingXXS: 4,
    },
  },
};
