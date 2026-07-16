import { PropertyCard } from "@/components/common/PropertyCard";
import HomeCarousel from "@/components/home/HomeCarousel";
import { propertyService } from "@/services/property.service";
import type { Property } from "@/types/property";

const RANDOM_LUCKY_LIMIT = 8;

type Props = {
  excludeIds?: number[];
};

function shuffleProperties(properties: Property[]) {
  return properties
    .map((property) => ({ property, sort: Math.random() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ property }) => property);
}

async function getLuckyPropertiesFromPublishedLists(excludeIds: number[]) {
  const excluded = new Set(excludeIds);
  const [freeResponse, standardResponse] = await Promise.all([
    propertyService.getAll({
      filters: {
        status: "PUBLISHED",
        priorityStatus: "FREE",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      limit: 24,
    }),
    propertyService.getAll({
      filters: {
        status: "PUBLISHED",
        priorityStatus: "STANDARD",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      limit: 24,
    }),
  ]);

  const candidates = [
    ...((freeResponse.data ?? []) as Property[]),
    ...((standardResponse.data ?? []) as Property[]),
  ].filter((property) => !excluded.has(property.id));

  return shuffleProperties(candidates).slice(0, RANDOM_LUCKY_LIMIT);
}

export default async function RandomLuckyPropertiesSection({
  excludeIds = [],
}: Props) {
  const randomLuckyProperties =
    await getLuckyPropertiesFromPublishedLists(excludeIds);

  if (randomLuckyProperties.length === 0) {
    return null;
  }

  return (
    <section className="layout-container layout-section-sm pt-0">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading text-center text-xl font-bold tracking-[-0.04em] uppercase lg:text-2xl">
          Gợi ý ngẫu nhiên
        </h2>

        <HomeCarousel className="py-2" options={{ align: "center" }}>
          {(randomLuckyProperties as Property[]).map((property, index) => (
            <div
              key={property.id}
              className="min-w-0 shrink-0 basis-11/12 pl-3"
            >
              <PropertyCard
                property={property}
                variant="lucky"
                priority={index === 0}
              />
            </div>
          ))}
        </HomeCarousel>

        <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
          {(randomLuckyProperties as Property[]).map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="lucky"
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
