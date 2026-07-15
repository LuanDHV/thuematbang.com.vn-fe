"use client";

import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "destructive" | "info" | "success";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

function toast(options: ToastOptions) {
  const baseOptions = {
    description: options.description,
    duration: options.duration,
  };

  switch (options.variant) {
    case "success":
      return sonnerToast.success(options.title, baseOptions);
    case "info":
      return sonnerToast.info(options.title, baseOptions);
    case "destructive":
      return sonnerToast.error(options.title, baseOptions);
    default:
      return sonnerToast(options.title, baseOptions);
  }
}

export function useToast() {
  return {
    toast,
  };
}

export { toast };
