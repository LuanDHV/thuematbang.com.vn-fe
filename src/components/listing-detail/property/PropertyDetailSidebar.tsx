import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";
import { User } from "@/types/user";

type RelatedCategoryCityLink = {
  label: string;
  href: string;
};

type PropertyDetailSidebarProps = {
  poster?: User;
  isLoggedIn: boolean;
  relatedCategoryCityLinks: RelatedCategoryCityLink[];
};

export default function PropertyDetailSidebar({
  poster,
  isLoggedIn,
  relatedCategoryCityLinks,
}: PropertyDetailSidebarProps) {
  return (
    <aside className="w-full space-y-6 lg:w-1/4">
      <div className="shadow-primary/50 self-start rounded-xl bg-white p-4 shadow lg:sticky lg:top-18">
        <PosterContactCard
          fullName={poster?.fullName}
          phone={poster?.phone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
        <h3 className="text-base font-semibold text-gray-700">Gợi ý theo khu vực</h3>
        {relatedCategoryCityLinks.length > 0 ? (
          <div className="mt-3">
            <div className="grid divide-y divide-gray-100">
              {relatedCategoryCityLinks.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className="group hover:text-primary flex items-center justify-between py-2.5 text-sm text-gray-700 transition-colors duration-200 ease-in-out"
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
