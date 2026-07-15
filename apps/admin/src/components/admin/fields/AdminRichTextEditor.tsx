import { useMemo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment, Autoformat, Bold, ClassicEditor, Essentials,
  FontColor, FontFamily, Heading, Image, ImageResize, ImageStyle,
  ImageToolbar, ImageUpload, Indent, Italic, Link, List,
  Paragraph, PasteFromOffice, RemoveFormat, Strikethrough, Underline,
  type EditorConfig, type FileLoader, type UploadAdapter,
} from "ckeditor5";
import viTranslations from "ckeditor5/translations/vi.js";
import "ckeditor5/ckeditor5.css";
import { uploadAdminMediaImage, type AdminCloudinaryUploadResourceType } from "../../../lib/admin/media";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  imageUpload?: { resourceType: AdminCloudinaryUploadResourceType; draftId: string; resourceId?: number | string };
};

class CloudinaryAdapter implements UploadAdapter {
  private loader: FileLoader;
  private imgUpload: NonNullable<Props["imageUpload"]>;

  constructor(loader: FileLoader, imgUpload: NonNullable<Props["imageUpload"]>) {
    this.loader = loader;
    this.imgUpload = imgUpload;
  }

  async upload() {
    const file = await this.loader.file;
    if (!file) throw new Error("Không thể chèn ảnh.");
    this.loader.uploadTotal = file.size;
    const result = await uploadAdminMediaImage(file, {
      resourceType: this.imgUpload.resourceType,
      draftId: this.imgUpload.draftId,
      resourceId: this.imgUpload.resourceId,
    }, (progress) => {
      this.loader.uploaded = Math.round((progress / 100) * file.size);
    });
    return { default: result.imageUrl };
  }

  abort() {}
}

export function AdminRichTextEditor({ value = "", onChange, placeholder = "Nhập nội dung...", imageUpload }: Props) {
  const [error, setError] = useState<string | null>(null);

  const config = useMemo((): EditorConfig => {
    const plugins: unknown[] = [
      Essentials, Autoformat, Paragraph, Heading, Bold, Italic,
      Underline, Strikethrough, FontColor, FontFamily,
      Alignment, List, Indent, Link, PasteFromOffice, RemoveFormat,
    ];
    const toolbar: string[] = [
      "undo", "redo", "|",
      "heading", "|",
      "bold", "italic", "underline", "strikethrough", "fontColor", "fontFamily", "|",
      "alignment:left", "alignment:center", "alignment:right", "alignment:justify", "|",
      "bulletedList", "numberedList", "|",
      "link", "|",
      "removeFormat",
    ];
    if (imageUpload) {
      plugins.push(Image, ImageUpload, ImageToolbar, ImageStyle, ImageResize);
      toolbar.splice(toolbar.indexOf("removeFormat"), 0, "imageUpload");
    }
    return {
      language: { ui: "vi", content: "vi" },
      translations: [viTranslations],
      placeholder,
      toolbar: { items: toolbar, shouldNotGroupWhenFull: true },
      alignment: { options: ["left", "center", "right", "justify"] },
      heading: {
        options: [
          { model: "paragraph", title: "Đoạn văn", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Tiêu đề 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Tiêu đề 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Tiêu đề 3", class: "ck-heading_heading3" },
        ],
      },
      link: {
        defaultProtocol: "https://",
        decorators: {
          openInNewTab: {
            mode: "manual",
            label: "Mở tab mới",
            defaultValue: true,
            attributes: { target: "_blank", rel: "noopener noreferrer" },
          },
        },
      },
      image: {
        toolbar: ["imageTextAlternative", "|", "imageStyle:alignLeft", "imageStyle:alignCenter", "imageStyle:alignRight", "|", "imageResize"],
        styles: { options: ["alignLeft", "alignCenter", "alignRight", "block"] },
        resizeUnit: "%",
        resizeOptions: [
          { name: "imageResize:original", value: null, label: "Gốc" },
          { name: "imageResize:25", value: "25", label: "25%" },
          { name: "imageResize:50", value: "50", label: "50%" },
          { name: "imageResize:75", value: "75", label: "75%" },
        ],
      },
      plugins: plugins as never[],
      licenseKey: "GPL",
    } as EditorConfig;
  }, [imageUpload, placeholder]);

  return (
    <div className={error ? "admin-rich-editor admin-rich-editor--error" : "admin-rich-editor"}>
      <CKEditor
        editor={ClassicEditor}
        config={config}
        data={value}
        onChange={(_, editor) => { onChange?.(editor.getData()); setError(null); }}
        onReady={(editor) => {
          if (!imageUpload) return;
          const repo = editor.plugins.get("FileRepository") as { createUploadAdapter?: (loader: FileLoader) => UploadAdapter };
          if (repo) repo.createUploadAdapter = (loader) => new CloudinaryAdapter(loader, imageUpload);
        }}
      />
      {error ? <div className="admin-rich-editor-error">{error}</div> : null}
    </div>
  );
}
