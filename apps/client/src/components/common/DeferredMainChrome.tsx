"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ProfileCompletionGate = dynamic(
  () => import("@/components/auth/ProfileCompletionGate"),
  { ssr: false },
);
const FloatingActions = dynamic(
  () => import("@/components/common/FloatingActions"),
  { ssr: false },
);
const FloatingContactButton = dynamic(
  () => import("@/components/common/FloatingContactButton"),
  { ssr: false },
);

export default function DeferredMainChrome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMounted(true);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <FloatingContactButton />
      <FloatingActions />
      <ProfileCompletionGate />
    </>
  );
}
