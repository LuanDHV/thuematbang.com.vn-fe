import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: bigint | number) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price)) + "/tháng"
  );
};

export const formatDate = (date?: Date | string | null) => {
  if (!date) return "Vừa đăng";
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "UTC" }).format(
    new Date(date),
  );
};
