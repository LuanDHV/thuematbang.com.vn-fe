import Link from "next/link";
import { News } from "@/types/news";

type NewsDetailSidebarProps = {
  viewedNews: News[];
};

export default function NewsDetailSidebar({
  viewedNews,
}: NewsDetailSidebarProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-24">
      <section className="surface-card border border-hairline p-5">
        <h2 className="text-heading text-base font-medium">
          <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
          Tin tức khác
        </h2>

        <div className="mt-3 grid divide-y divide-hairline">
          {viewedNews.map((item) => (
            <Link
              key={item.id}
              href={`/tin-tuc/${item.slug}`}
              className="group text-body hover:text-primary py-2.5 text-sm font-medium transition-all duration-200"
            >
              <span className="line-clamp-2">{item.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
