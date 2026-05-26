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
  title,
  message,
  retryLabel,
}: DataErrorCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <AlertTriangle size={20} />
      </div>
      <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
      <p className="mt-1 text-sm text-amber-800">{message}</p>
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
