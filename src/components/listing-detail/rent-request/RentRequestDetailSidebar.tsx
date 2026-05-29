import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";
import { RentRequest } from "@/types/rent-request";

type RentRequestDetailSidebarProps = {
  contactName?: string | null;
  contactPhone?: string | null;
  isLoggedIn: boolean;
  latestWantedProperties: RentRequest[];
};

export default function RentRequestDetailSidebar({
  contactName,
  contactPhone,
  isLoggedIn,
  latestWantedProperties,
}: RentRequestDetailSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:w-1/4">
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
          Tin cần thuê mới nhất
        </h3>

        {latestWantedProperties.length > 0 ? (
          <div className="mt-3 grid divide-y divide-black/6">
            {latestWantedProperties.map((item) => (
              <Link
                href={`/can-thue/${item.slug}`}
                key={item.id}
                className="group text-body hover:text-primary flex items-center justify-between py-2.5 text-sm font-medium transition-all duration-200"
              >
                <span className="line-clamp-2">{item.title}</span>
                <ArrowRight
                  size={12}
                  className="text-secondary transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
