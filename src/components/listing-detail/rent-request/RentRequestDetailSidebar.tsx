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
      <div className="surface-panel w-full self-start p-5 lg:sticky lg:top-18">
        <PosterContactCard
          fullName={contactName}
          phone={contactPhone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="surface-card hidden p-5 lg:block">
        <h3 className="text-heading text-base font-semibold tracking-[-0.02em]">
          Tin cần thuê mới nhất
        </h3>
        {latestWantedProperties.length > 0 ? (
          <div className="mt-3 grid divide-y divide-black/6">
            {latestWantedProperties.map((item) => (
              <Link
                href={`/can-thue/${item.slug}`}
                key={item.id}
                className="group text-body hover:text-primary flex items-center justify-between py-3 text-sm transition-colors duration-200 ease-in-out"
              >
                <span className="line-clamp-2 font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
