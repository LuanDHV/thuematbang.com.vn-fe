import { Property } from "@/types/property";
import { MapPin, Bed, Bath, Square, Eye } from "lucide-react";
import Image from "next/image";

// Hàm format giá tiền (xử lý BigInt)
const formatPrice = (price: bigint | number) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price)) + "/tháng"
  );
};

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.thumbnailUrl || "/imgs/wallpaper-1.jpg"} // Placeholder nếu chưa có field image trong schema
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badge lượt xem - Giống ảnh mẫu */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
          <Eye size={14} />
          <span>482</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-5">
        {/* Price - Màu Primary rực rỡ */}
        <div className="text-primary mb-2 text-xl font-bold">
          {formatPrice(property.price || 0)}
        </div>

        {/* Title */}
        <h3 className="group-hover:text-primary mb-2 line-clamp-1 text-lg font-bold text-gray-900 transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <div className="mb-4 flex items-center gap-1 text-sm text-gray-400">
          <MapPin size={16} className="shrink-0" />
          <span className="line-clamp-1">
            {property.district?.name}, {property.city?.name}
          </span>
        </div>

        {/* Stats - Ngăn cách bằng đường line mảnh */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <Bed size={18} className="text-gray-400" />
            <span className="text-sm font-medium">
              {property.bedrooms || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={18} className="text-gray-400" />
            <span className="text-sm font-medium">
              {property.bathrooms || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square size={16} className="text-gray-400" />
            <span className="text-sm font-medium">{property.area}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
