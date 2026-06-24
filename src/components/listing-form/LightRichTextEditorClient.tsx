"use client";

import { useMemo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Strikethrough,
  Underline,
  type EditorConfig,
  type FileLoader,
  type UploadAdapter,
} from "ckeditor5";
import viTranslations from "ckeditor5/translations/vi.js";

import { uploadCloudinaryImage } from "@/lib/cloudinary-upload";
import type { CloudinaryUploadResourceType } from "@/types/cloudinary";
import styles from "./LightRichTextEditor.module.css";

type LightRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  insertLink?: boolean;
  imageUpload?: {
    resourceType: CloudinaryUploadResourceType;
    draftId: string;
    resourceId?: number | string;
  };
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const DEFAULT_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

function getFileError(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Định dạng ảnh không hợp lệ. Vui lòng chọn JPEG, JPG, PNG hoặc WEBP.";
  }

  if (file.size > DEFAULT_MAX_FILE_SIZE_BYTES) {
    return "Ảnh vượt quá 2MB.";
  }

  return null;
}

async function uploadRichTextImage(
  file: File,
  imageUpload: NonNullable<LightRichTextEditorProps["imageUpload"]>,
  onProgress?: (progress: number) => void,
) {
  return uploadCloudinaryImage(
    file,
    {
      resourceType: imageUpload.resourceType,
      draftId: imageUpload.draftId,
      resourceId: imageUpload.resourceId,
    },
    onProgress,
  );
}

class CloudinaryUploadAdapter implements UploadAdapter {
  private aborted = false;

  constructor(
    private readonly loader: FileLoader,
    private readonly imageUpload: NonNullable<
      LightRichTextEditorProps["imageUpload"]
    >,
    private readonly setImageError: (message: string | null) => void,
  ) {}

  async upload() {
    const file = await this.loader.file;

    if (this.aborted) {
      throw new Error("Đã hủy tải ảnh.");
    }

    if (!file) {
      throw new Error("Không thể chèn ảnh.");
    }

    const fileError = getFileError(file);
    if (fileError) {
      this.setImageError(fileError);
      throw new Error(fileError);
    }

    this.setImageError(null);
    this.loader.uploadTotal = file.size;

    const uploadedImage = await uploadRichTextImage(
      file,
      this.imageUpload,
      (progress) => {
        this.loader.uploaded = Math.round((progress / 100) * file.size);
      },
    );

    return {
      default: uploadedImage.imageUrl,
    };
  }

  abort() {
    this.aborted = true;
  }
}

function buildEditorConfig(
  placeholder: string,
  insertLink: boolean,
  imageUpload: LightRichTextEditorProps["imageUpload"],
): EditorConfig {
  const withImageUpload = Boolean(imageUpload);
  const withInsertLink = Boolean(insertLink);
  const toolbarItems = [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "alignment:justify",
    "|",
    "bulletedList",
    "numberedList",
    ...(withInsertLink ? ["|", "link"] : []),
    ...(withImageUpload ? ["imageUpload"] : []),
    "removeFormat",
  ] as const;

  return {
    language: {
      ui: "vi",
      content: "vi",
    },
    translations: [viTranslations],
    placeholder,
    ui: {
      poweredBy: {
        position: "inside",
        side: "right",
        label: null,
      },
    },
    alignment: {
      options: ["left", "center", "right", "justify"],
    },
    toolbar: {
      items: [...toolbarItems],
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Đoạn văn",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Tiêu đề 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Tiêu đề 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Tiêu đề 3",
          class: "ck-heading_heading3",
        },
      ],
    },
    plugins: [
      Essentials,
      Autoformat,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Alignment,
      List,
      Indent,
      Link,
      PasteFromOffice,
      RemoveFormat,
      ...(withImageUpload ? [Image, ImageUpload] : []),
    ],
    licenseKey: "GPL",
  } as EditorConfig;
}

export default function LightRichTextEditorClient({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  insertLink = false,
  imageUpload,
}: LightRichTextEditorProps) {
  const [imageError, setImageError] = useState<string | null>(null);

  const editorConfig = useMemo(
    () => buildEditorConfig(placeholder, insertLink, imageUpload),
    [imageUpload, insertLink, placeholder],
  );

  return (
    <div className={styles.wrapper}>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={value}
        onChange={(_, editor) => {
          onChange(editor.getData());
          if (imageError) {
            setImageError(null);
          }
        }}
        onReady={(editor) => {
          if (!imageUpload) {
            return;
          }

          const fileRepository = editor.plugins.get("FileRepository");
          fileRepository.createUploadAdapter = (loader) =>
            new CloudinaryUploadAdapter(loader, imageUpload, setImageError);
        }}
      />

      {imageError ? <div className={styles.error}>{imageError}</div> : null}
    </div>
  );
}
