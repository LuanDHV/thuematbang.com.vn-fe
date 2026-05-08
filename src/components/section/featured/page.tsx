import { PropertyCard } from "@/components/common/PropertyCard";
import Title from "@/components/common/Title";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";

export default function FeaturedSection({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <section className="bg-slate-50/50 py-24">
      <div className="container mx-auto px-4">
        {/* Tái sử dụng Title Component */}
        <Title
          title="Bất động sản nổi bật"
          description="Khám phá những không gian sống và làm việc đẳng cấp nhất, được chúng tôi tuyển chọn kỹ lưỡng về vị trí, tiện ích và giá trị."
        />

        {/* Grid List */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {properties?.map((item: Property) => (
            <PropertyCard key={item.id} property={item} />
          ))}
        </div>

        {/* Nút Xem Thêm - Style Sang Trọng */}
        <div className="mt-16 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary shadow-primary/10 h-14 rounded-full px-10 font-bold tracking-widest uppercase shadow-lg transition-all duration-300 hover:text-white"
          >
            Xem thêm tất cả
          </Button>
        </div>
      </div>
    </section>
  );
}
