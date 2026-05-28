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
    <aside className="flex w-full flex-col gap-6 lg:w-1/4">
      <div className="surface-panel w-full self-start p-5 lg:sticky lg:top-18">
        <PosterContactCard
          fullName={contactName}
          phone={contactPhone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="surface-card hidden p-5 lg:block">
        <h3 className="text-heading text-base font-semibold tracking-[-0.02em]">
          Gợi ý theo khu vực
        </h3>
        {relatedCategoryCityLinks.length > 0 ? (
          <div className="mt-3">
            <div className="grid divide-y divide-black/6">
              {relatedCategoryCityLinks.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="group text-body hover:text-primary flex items-center justify-between py-3 text-sm transition-colors duration-200 ease-in-out"
                >
                  <span className="line-clamp-1 font-medium">{item.label}</span>
                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </aside>
  );
}
