import Link from "next/link";
import { Project } from "@/types/project";

type ProjectDetailSidebarProps = {
  viewedProjects: Project[];
};

export default function ProjectDetailSidebar({
  viewedProjects,
}: ProjectDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <section className="surface-card rounded-2xl border border-hairline p-5">
        <h2 className="text-heading text-base font-medium">
          <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
          Dự án khác
        </h2>

        <div className="mt-3 grid divide-y divide-hairline">
          {viewedProjects.map((item) => (
            <Link
              key={item.id}
              href={`/du-an/${item.slug}`}
              className="group text-body hover:text-primary py-2.5 text-sm font-medium transition-all duration-200"
            >
              <span className="line-clamp-2">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
