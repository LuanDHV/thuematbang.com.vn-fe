import { Property } from "@/types/property";
import { MapPin, Eye, Square, Calendar } from "lucide-react";
import Image from "next/image";

const formatPrice = (price: bigint | number) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price)) + "/tháng"
  );
};

export function PropertyCard({ property }: { property: Property }) {
  // Định dạng ngày tháng ngay tại đây
  const dateStr = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("vi-VN")
    : "Vừa đăng";

  return (
    <div className="group hover:shadow-primary/5 hover:-trangray-y-1 flex min-h-115 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      {/* Image Container - Tăng chiều cao lên h-48 để nhìn thoáng hơn */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property?.thumbnailUrl || "/imgs/wallpaper-1.jpg"}
          alt={property?.title || "Bất động sản"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />

        {/* Badge hiển thị dựa trên priorityStatus */}
        {property.priorityStatus !== "normal" && (
          <div
            className={
              "absolute top-3 left-3 rounded bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white uppercase shadow-sm transition-all"
            }
          >
            {property.priorityStatus}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-4">
        {/* Title - Tăng size chữ và chiều cao dòng */}
        <h3 className="group-hover:text-primary line-clamp-2 min-h-10 text-lg leading-snug font-bold text-gray-800 transition-colors">
          {property.title}
        </h3>

        {/* Price & Area - Đưa lên cùng hàng để tối ưu không gian */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-primary text-base font-bold tracking-tight">
            {formatPrice(property.price || 0)}
          </div>
        </div>

        {/* Address & Area gộp chung một hàng */}
        <div className="flex flex-col gap-y-1 text-xs text-gray-400">
          {/* Khối Địa chỉ */}
          <div className="mb-2 flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1 text-sm font-medium">
              {property.district?.name}, {property.city?.name}
            </span>
          </div>

          {/* Khối Diện tích */}
          <div className="mb-2 flex items-center gap-1.5">
            <Square size={13} className="shrink-0" />
            <span className="line-clamp-1 text-sm font-medium">
              {property.area}m²
            </span>
          </div>

          {/* Khối mô tả */}
          <div className="mb-2 flex items-center gap-1.5">
            <span className="line-clamp-2 text-sm font-medium">
              {property.description}
            </span>
          </div>
        </div>

        {/* Footer Stats - Ngăn cách rõ ràng bằng border và khoảng trống */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 text-[11px] font-medium text-gray-400">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar size={13} strokeWidth={2.5} />
            <span>{dateStr}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2 py-0.5 text-xs">
            <Eye size={13} strokeWidth={2.5} />
            <span>{property.viewCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
