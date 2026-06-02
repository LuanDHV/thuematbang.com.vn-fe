import { FileText } from "lucide-react";

type AdminComingSoonPanelProps = {
  title: string;
  description: string;
  notes?: string[];
};

export default function AdminComingSoonPanel({
  title,
  description,
  notes = [],
}: AdminComingSoonPanelProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          {title}
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          {description}
        </p>
      </div>

      <article className="surface-panel p-6">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl">
            <FileText className="size-5" />
          </div>
          <div className="space-y-3">
            <p className="text-heading text-base font-semibold">
              Chưa có dữ liệu list
            </p>
            <p className="text-secondary text-sm leading-6">
              Module này đã có route chuẩn trong sidebar, nhưng backend hiện
              chưa có endpoint list đủ rõ để dựng bảng thực tế. Có thể nối vào
              sau mà không đổi layout.
            </p>
            {notes.length > 0 ? (
              <ul className="text-secondary list-disc space-y-2 pl-5 text-sm leading-6">
                {notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  );
}
