"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import type { CloudinaryUploadResourceType } from "@/types/cloudinary";
import styles from "./LightRichTextEditor.module.css";

type LightRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  imageUpload?: {
    resourceType: CloudinaryUploadResourceType;
    draftId: string;
    resourceId?: number | string;
  };
};

const CKEditorLightRichTextEditor = dynamic(
  () => import("./LightRichTextEditorClient"),
  {
    ssr: false,
    loading: () => (
      <div className={cn(styles.wrapper, "bg-surface min-h-72")} />
    ),
  },
);

export function LightRichTextEditor(props: LightRichTextEditorProps) {
  return (
    <div className={cn(styles.shell, props.className)}>
      <CKEditorLightRichTextEditor {...props} />
    </div>
  );
}
