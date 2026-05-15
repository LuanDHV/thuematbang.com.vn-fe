import { ArrowRight } from "lucide-react";
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
    <aside className="w-full space-y-6 lg:w-1/4">
      <div className="shadow-primary/50 self-start rounded-xl bg-white p-4 shadow lg:sticky lg:top-18">
        <PosterContactCard
          fullName={poster?.fullName}
          phone={companyPhone}
          canRevealPhone={isLoggedIn}
        />
      </div>

      <section className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
        <h3 className="text-base font-semibold text-gray-700">
          Tin cần thuê mới nhất
        </h3>
        {latestWantedProperties.length > 0 ? (
          <div className="mt-3 grid divide-y divide-gray-100">
            {latestWantedProperties.map((item) => (
              <Link
                href={`/can-thue/${item.slug}`}
                key={item.id}
                className="group hover:text-primary flex items-center justify-between py-2.5 text-sm text-gray-700 transition-colors duration-200 ease-in-out"
              >
                <span className="line-clamp-2 font-medium">{item.title}</span>
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </aside>
  );
}
