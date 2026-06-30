import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";

type RelatedCategoryProvinceLink = {
  label: string;
  href: string;
};

type PropertyDetailSidebarProps = {
  contactName?: string | null;
  propertyId: number;
  relatedCategoryProvinceLinks: RelatedCategoryProvinceLink[];
};

export default function PropertyDetailSidebar({
  contactName,
  propertyId,
  relatedCategoryProvinceLinks,
}: PropertyDetailSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-6">
      <div
        id="detail-contact-card"
        className="surface-utility relative z-20 w-full scroll-mt-24 self-start p-5 lg:sticky lg:top-22"
      >
        <PosterContactCard fullName={contactName} propertyId={propertyId} />
      </div>

      <section className="surface-utility hidden p-5 lg:block">
        <h3 className="text-heading text-base font-medium">
          <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
          Gợi ý theo khu vực
        </h3>

        {relatedCategoryProvinceLinks.length > 0 ? (
          <div className="mt-3">
            <div className="divide-hairline grid divide-y">
              {relatedCategoryProvinceLinks.map((item) => (
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
