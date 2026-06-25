import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";
import { RentRequest } from "@/types/rent-request";

const RENT_REQUEST_CONTACT_PHONE = "09686880818";

type RentRequestDetailSidebarProps = {
  contactName?: string | null;
  isLoggedIn: boolean;
  latestWantedProperties: RentRequest[];
};

export default function RentRequestDetailSidebar({
  contactName,
  isLoggedIn,
  latestWantedProperties,
}: RentRequestDetailSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-6">
      <div
        id="detail-contact-card"
        className="surface-card relative z-20 w-full scroll-mt-24 self-start p-5 lg:sticky lg:top-18"
      >
        <PosterContactCard
          fullName={contactName}
          phone={RENT_REQUEST_CONTACT_PHONE}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="surface-card border-hairline hidden border p-5 lg:block">
        <h3 className="text-heading text-base font-medium">
          <span className="bg-primary mr-2 inline-block h-4 w-0.5 rounded-full align-middle" />
          Tin cần thuê mới nhất
        </h3>

        {latestWantedProperties.length > 0 ? (
          <div className="divide-hairline mt-3 grid divide-y">
            {latestWantedProperties.map((item) => (
              <Link
                href={`/can-thue/${item.slug}`}
                key={item.id}
                className="group text-body hover:text-primary flex items-center justify-between py-2.5 text-sm font-medium transition-all duration-200"
              >
                <span className="line-clamp-2">{item.title}</span>
                <ArrowRight
                  size={14}
                  className="text-secondary group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
