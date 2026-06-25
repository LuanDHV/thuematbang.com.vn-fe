import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge conditional class names while preserving Tailwind override order.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
