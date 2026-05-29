import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";

type RelatedCategoryCityLink = {
  label: string;
  href: string;
};

type PropertyDetailSidebarProps = {
  contactName?: string | null;
  contactPhone?: string | null;
  isLoggedIn: boolean;
  relatedCategoryCityLinks: RelatedCategoryCityLink[];
};

export default function PropertyDetailSidebar({
  contactName,
  contactPhone,
  isLoggedIn,
  relatedCategoryCityLinks,
}: PropertyDetailSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6">
      <div className="surface-card w-full self-start p-5 lg:sticky lg:top-18">
        <PosterContactCard
          fullName={contactName}
          phone={contactPhone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="surface-card hidden rounded-2xl border p-5 lg:block">
        <h3 className="text-heading text-base font-medium">
          <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
          Gợi ý theo khu vực
        </h3>

        {relatedCategoryCityLinks.length > 0 ? (
          <div className="mt-3">
            <div className="grid divide-y divide-black/6">
              {relatedCategoryCityLinks.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="group text-body hover:text-primary flex items-center justify-between py-2.5 text-sm font-medium transition-all duration-200"
                >
                  <span className="line-clamp-1">{item.label}</span>
                  <ArrowRight
                    size={14}
                    className="text-secondary group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </aside>
  );
}
