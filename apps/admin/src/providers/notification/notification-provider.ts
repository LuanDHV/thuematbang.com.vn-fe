import { notification } from "antd";
import type { NotificationProvider } from "@refinedev/core";

const TYPE_MAP: Record<string, "success" | "error" | "info" | "warning"> = {
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
  progress: "info",
};

export const notifProvider: NotificationProvider = {
  open: ({ message, description, type, key }) => {
    const resolvedType = TYPE_MAP[type || "info"] || "info";
    notification[resolvedType]({
      message,
      description,
      key,
      placement: "topRight",
    });
  },
  close: (key) => {
    notification.destroy(key);
  },
};
