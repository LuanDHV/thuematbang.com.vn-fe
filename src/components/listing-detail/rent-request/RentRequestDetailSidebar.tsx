import Link from "next/link";
import PosterContactCard from "@/components/common/PosterContactCard";
import { RentRequest } from "@/types/rent-request";
import { User } from "@/types/user";

type RentRequestDetailSidebarProps = {
  poster?: User;
  isLoggedIn: boolean;
  latestWantedProperties: RentRequest[];
  companyPhone?: string;
};

export default function RentRequestDetailSidebar({
  poster,
  isLoggedIn,
  latestWantedProperties,
  companyPhone = "0968688081",
}: RentRequestDetailSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-6 lg:w-1/4">
      <div className="surface-panel self-start p-5 lg:sticky lg:top-18">
        <PosterContactCard
          fullName={poster?.fullName}
          phone={companyPhone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="surface-card hidden p-5 lg:block">
        <h3 className="text-base font-semibold tracking-[-0.02em] text-heading">
          Tin cần thuê mới nhất
        </h3>
        {latestWantedProperties.length > 0 ? (
          <div className="mt-3 grid divide-y divide-black/6">
            {latestWantedProperties.map((item) => (
              <Link
                href={`/can-thue/${item.slug}`}
                key={item.id}
                className="group flex items-center justify-between py-3 text-sm text-body transition-colors duration-200 ease-in-out hover:text-primary"
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
