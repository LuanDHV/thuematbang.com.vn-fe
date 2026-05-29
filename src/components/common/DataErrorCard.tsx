"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DataErrorCardProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  className?: string;
};

export default function DataErrorCard({
  title = "Không thể tải dữ liệu",
  message = "Đã có lỗi xảy ra. Vui lòng thử lại.",
  retryLabel = "Thử lại",
}: DataErrorCardProps) {
  const router = useRouter();

  return (
    <div className="surface-card rounded-2xl p-6 text-center">
      <div className="surface-subtle text-primary mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full">
        <AlertTriangle size={20} />
      </div>
      <h3 className="text-heading text-lg font-semibold">{title}</h3>
      <p className="text-secondary mt-1 text-sm">{message}</p>
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => router.refresh()}
          className="bg-primary inline-flex items-center gap-2 text-white"
        >
          <RotateCcw size={14} />
          {retryLabel}
        </Button>
      </div>
    </div>
  );
}
