import { useState, useRef, useEffect, type ChangeEventHandler } from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Image, Progress } from "antd";
import {
  deleteAdminMediaImage,
  normalizeGalleryImage,
  uploadAdminMediaImage,
  type AdminCloudinaryUploadResourceType,
  type AdminGalleryImage,
} from "../../../lib/admin/media";

type Props = {
  value: AdminGalleryImage[];
  onChange: (value: AdminGalleryImage[]) => void;
  label?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  maxFiles?: number;
  maxFileSizeBytes?: number;
  resourceType: AdminCloudinaryUploadResourceType;
  draftId: string;
  resourceId?: number | string;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
};

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function getFileError(file: File, maxBytes: number) {
  if (!ALLOWED_TYPES.has(file.type)) return "Định dạng ảnh không hợp lệ.";
  if (file.size > maxBytes)
    return `Ảnh vượt quá ${Math.floor(maxBytes / 1024 / 1024)}MB.`;
  return null;
}

export function AdminGalleryField({
  value,
  onChange,
  label = "Hình ảnh",
  description,
  error,
  required = false,
  maxFiles = 25,
  maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
  resourceType,
  draftId,
  resourceId,
  onBusyChange,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  const onFiles: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || uploading || disabled) return;
    const slots = Math.max(maxFiles - value.length, 0);
    const valid = files
      .filter((f) => getFileError(f, maxFileSizeBytes) === null)
      .slice(0, slots);
    if (!valid.length) return;

    setUploading(true);
    setProgress(0);
    const total = valid.length;
    const pm = new Map<number, number>();

    try {
      const results = await Promise.allSettled(
        valid.map((file, idx) =>
          uploadAdminMediaImage(
            file,
            { resourceType, draftId, resourceId },
            (p) => {
              pm.set(idx, p);
              let sum = 0;
              for (const v of pm.values()) sum += v;
              setProgress(Math.min(100, Math.round(sum / total)));
            }
          )
        )
      );
      const next = [...value];
      results.forEach((r) => {
        if (r.status === "fulfilled")
          next.push(
            normalizeGalleryImage({
              ...r.value,
              persisted: false,
              sortOrder: next.length,
            })
          );
      });
      onChange(next);
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const move = (idx: number, dir: -1 | 1) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= value.length) return;
    const items = [...value];
    [items[idx], items[ni]] = [items[ni], items[idx]];
    onChange(items.map((item, i) => ({ ...item, sortOrder: i })));
  };

  const remove = async (idx: number) => {
    const img = value[idx];
    if (!img) return;
    if (img.imagePublicId) await deleteAdminMediaImage(img.imagePublicId);
    onChange(
      value
        .filter((_, i) => i !== idx)
        .map((item, i) => ({ ...item, sortOrder: i }))
    );
  };

  return (
    <div>
      <div
        className="admin-gallery-toolbar"
      >
        <div className="admin-gallery-toolbar-copy">
          <div className="admin-gallery-toolbar-title">
            {label}
            {required ? <span className="admin-gallery-required-mark">*</span> : null}
          </div>
          {description ? (
            <div className="admin-gallery-toolbar-description">
              {description}
            </div>
          ) : null}
        </div>
        {!disabled && (
          <label
            className="admin-gallery-upload"
          >
            <CloudUploadOutlined />
            <span>{uploading ? "Đang tải ảnh..." : "Tải ảnh lên"}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="hidden-file-input"
              onChange={onFiles}
            />
          </label>
        )}
      </div>
      {uploading && (
        <Progress
          percent={progress}
          size="small"
          style={{ marginBottom: 12 }}
        />
      )}
      <div className="admin-gallery-grid">
        {value.length > 0 ? (
          value.map((img, idx) => (
            <div
              key={img.id ?? img.imagePublicId ?? idx}
              className="admin-gallery-item"
            >
              <Image
                src={img.imageUrl}
                className="admin-gallery-thumb"
                preview
              />
              <div className="admin-gallery-caption">
                {img.persisted ? "Đã lưu" : "Chờ lưu"} • {idx + 1}
              </div>
              <div className="admin-gallery-actions">
                <Button
                  type="text"
                  size="small"
                  disabled={disabled || idx === 0}
                  onClick={() => move(idx, -1)}
                  icon={<ArrowUpOutlined />}
                />
                <Button
                  type="text"
                  size="small"
                  disabled={disabled || idx === value.length - 1}
                  onClick={() => move(idx, 1)}
                  icon={<ArrowDownOutlined />}
                />
                <Button
                  type="text"
                  danger
                  size="small"
                  disabled={disabled}
                  onClick={() => {
                    void remove(idx);
                  }}
                  icon={<DeleteOutlined />}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="admin-gallery-empty">Chưa có ảnh nào.</div>
        )}
      </div>
      {error ? (
        <div className="admin-gallery-error">{error}</div>
      ) : null}
    </div>
  );
}
