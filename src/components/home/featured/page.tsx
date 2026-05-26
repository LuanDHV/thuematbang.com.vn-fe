import Title from "@/components/common/Title";
import SeeMoreButton from "@/components/common/SeeMoreButton";
import { PropertyCard } from "@/components/common/PropertyCard";
import { Property } from "@/types";
import { propertyService } from "@/services/property.service";
import DataErrorCard from "@/components/common/DataErrorCard";

export default async function FeaturedSection() {
  let featuredProperties: Property[] = [];
  try {
    // Fetch featured properties for homepage section.
    console.log("[server] Fetch featured properties", {
      limit: 8,
    });
    const response = await propertyService.getAll({
      filters: { isFeatured: true },
      limit: 8,
    });
    featuredProperties = response.data ?? [];
  } catch {
    return (
      <section className="w-full px-4 py-12">
        <div className="mx-auto w-full max-w-7xl px-4">
          <Title
            title="Bất động sản nổi bật"
            description="Khám phá những bất động sản đáng chú ý trên thị trường."
          />
          <div className="mt-8">
            <DataErrorCard message="Không tải được danh sách bất động sản nổi bật." />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto w-full max-w-7xl px-4">
        <Title
          title="Bất động sản nổi bật"
          description="Khám phá những không gian sống và làm việc đẳng cấp nhất, được chúng tôi tuyển chọn kỹ lưỡng về vị trí, tiện ích và giá trị."
        />
        {/* Grid List */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredProperties.map((item: Property) => (
            <PropertyCard key={item.id} property={item} variant="featured" />
          ))}
        </div>

        <SeeMoreButton href="cho-thue" />
      </div>
    </section>
  );
}
