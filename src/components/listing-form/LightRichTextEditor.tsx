"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Italic,
  Undo2,
  Redo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LightRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "outline"}
      size="icon-sm"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg"
    >
      {children}
    </Button>
  );
}

export function LightRichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}: LightRichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder],
  );

  const editor = useEditor({
    extensions,
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-48 px-4 py-3 text-body focus:outline-none prose-headings:text-heading prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
      },
    },
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextValue = value || "";
    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className={cn("rounded-xl border border-hairline bg-surface", className)}>
        <div className="px-4 py-3 text-sm text-secondary">
          Đang khởi tạo trình soạn thảo...
        </div>
      </div>
    );
  }

  const applyLink = () => {
    const trimmedUrl = linkUrl.trim();
    if (!trimmedUrl) return;

    editor.chain().focus().setLink({ href: trimmedUrl }).run();
    setLinkUrl("");
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-hairline bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline p-2">
        <ToolbarButton
          title="Đậm"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Nghiêng"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Danh sách số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Xóa định dạng"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <Pilcrow className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Hoàn tác"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Làm lại"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>

        <div className="ml-auto flex min-w-0 flex-1 flex-wrap items-center gap-2 md:flex-nowrap">
          <Input
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="Dán link để chèn"
            className="h-9 min-w-0 flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={applyLink}
            disabled={!linkUrl.trim()}
          >
            <Link2 className="mr-2 size-4" />
            Chèn link
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} className="min-h-48" />
    </div>
  );
}
