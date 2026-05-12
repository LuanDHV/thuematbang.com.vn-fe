"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  MapPin,
  ChevronRight,
  CircleDollarSign,
  Maximize,
  Plus,
  ShieldCheck,
  Award,
} from "lucide-react";

// Dữ liệu 8 hướng nhà
const DIRECTIONS = [
  { id: "bac", label: "Bắc" },
  { id: "dong-bac", label: "Đông Bắc" },
  { id: "dong", label: "Đông" },
  { id: "dong-nam", label: "Đông Nam" },
  { id: "nam", label: "Nam" },
  { id: "tay-nam", label: "Tây Nam" },
  { id: "tay", label: "Tây" },
  { id: "tay-bac", label: "Tây Bắc" },
];

export function AdvancedSearchModal({
  filterCount = 0,
}: {
  filterCount?: number;
}) {
  // State quản lý hướng nhà được chọn
  const [selectedDirs, setSelectedDirs] = useState<string[]>([]);

  // Hàm chọn/bỏ chọn hướng nhà
  const toggleDirection = (id: string) => {
    setSelectedDirs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative h-10 w-10 shrink-0 cursor-pointer rounded-xl border-gray-200 bg-white p-0 transition-all hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 text-gray-600" />
          {filterCount > 0 && (
            <span className="bg-primary absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
              {filterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-h-[85vh]">
        {/* Header */}
        <DialogHeader className="shrink-0 border-b border-gray-100 p-4">
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            Bộ lọc
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="mua" className="flex min-h-0 flex-1 flex-col">
          {/* Nút Tab */}
          <div className="shrink-0 px-4 pt-4 sm:px-6">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
              <TabsTrigger
                value="mua"
                className="data-[state=active]:bg-primary rounded-md text-sm font-semibold text-gray-500 transition-all data-[state=active]:text-white"
              >
                Tìm mua
              </TabsTrigger>
              <TabsTrigger
                value="thue"
                className="data-[state=active]:bg-primary rounded-md text-sm font-semibold text-gray-500 transition-all data-[state=active]:text-white"
              >
                Tìm thuê
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Nội dung cuộn */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <TabsContent value="mua" className="mt-0 space-y-7">
              {/* Loại bất động sản */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-gray-800">
                  Loại bất động sản
                </label>
                <div>
                  <Button
                    variant="ghost"
                    className="text-primary hover:bg-primary/5 flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm
                  </Button>
                </div>
              </div>

              {/* Các menu điều hướng */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-gray-800">
                    Khu vực & Dự án
                  </label>
                  <button className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 px-4 transition-colors outline-none hover:bg-gray-50">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm">Trên toàn quốc</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-gray-800">
                    Khoảng giá
                  </label>
                  <button className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 px-4 transition-colors outline-none hover:bg-gray-50">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <CircleDollarSign className="h-5 w-5" />
                      <span className="text-sm">Tất cả</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-gray-800">
                    Diện tích
                  </label>
                  <button className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 px-4 transition-colors outline-none hover:bg-gray-50">
                    <div className="flex items-center gap-2.5 text-gray-600">
                      <Maximize className="h-5 w-5" />
                      <span className="text-sm">Tất cả</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Thông số phòng */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-gray-800">
                  Số phòng ngủ
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={num}
                      className="hover:border-primary hover:text-primary flex h-10 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-gray-800">
                  Số phòng tắm, vệ sinh
                </label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={`bath-${num}`}
                      className="hover:border-primary hover:text-primary flex h-10 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHỌN HƯỚNG NHÀ (WHEEL UI) BẰNG SVG */}
              <div className="space-y-4">
                <label className="text-[15px] font-semibold text-gray-800">
                  Hướng nhà
                </label>
                <div className="flex justify-center py-2">
                  <svg
                    viewBox="-5 -5 210 210"
                    className="mx-auto h-55 w-55 drop-shadow-sm"
                  >
                    {DIRECTIONS.map((dir, i) => {
                      const angle = i * 45; // Góc quay của từng lát cắt
                      const textAngle = angle - 90; // SVG text bắt đầu từ 3h, ta lùi 90 độ để về 12h
                      // Tính toán vị trí chữ dựa theo lượng giác (sin/cos)
                      const textX =
                        100 + 70 * Math.cos((textAngle * Math.PI) / 180);
                      const textY =
                        100 + 70 * Math.sin((textAngle * Math.PI) / 180);

                      const isSelected = selectedDirs.includes(dir.id);

                      return (
                        <g
                          key={dir.id}
                          onClick={() => toggleDirection(dir.id)}
                          className="group cursor-pointer"
                        >
                          {/* Lát cắt SVG: Cung ngoài R=100, cung trong r=40 */}
                          <path
                            d="M 61.73 7.61 A 100 100 0 0 1 138.27 7.61 L 115.31 63.04 A 40 40 0 0 0 84.69 63.04 Z"
                            transform={`rotate(${angle} 100 100)`}
                            className={`stroke-white stroke-[2.5px] transition-colors duration-200 ${
                              isSelected
                                ? "fill-primary"
                                : "fill-[#f4f4f4] group-hover:fill-gray-200"
                            }`}
                          />
                          {/* Text trên bánh xe */}
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`pointer-events-none text-[10px] transition-colors duration-200 ${
                              isSelected
                                ? "fill-white font-bold"
                                : "fill-gray-600 font-medium"
                            }`}
                          >
                            {dir.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </TabsContent>

            {/* TAB: TÌM THUÊ */}
            <TabsContent value="thue" className="mt-0 space-y-7">
              {/* Nội thất */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-gray-800">
                  Nội thất
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Đầy đủ", "Cơ bản", "Không nội thất", "Khác"].map(
                    (item) => (
                      <button
                        key={item}
                        className="hover:border-primary hover:text-primary flex h-9 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors"
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Tiện ích */}
              <div className="space-y-3">
                <label className="text-[15px] font-semibold text-gray-800">
                  Tiện ích
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Có dịch vụ bảo vệ", "Có camera", "Có PCCC"].map((item) => (
                    <button
                      key={item}
                      className="hover:border-primary hover:text-primary flex h-9 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Các Select Chi phí */}
              <div className="space-y-4 pt-2">
                <label className="text-[15px] font-semibold text-gray-800">
                  Chi phí (Đặc thù thuê)
                </label>
                <div className="grid gap-3">
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl text-gray-600">
                      <SelectValue placeholder="Mức giá điện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nha-nuoc">Giá nhà nước</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl text-gray-600">
                      <SelectValue placeholder="Mức giá nước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-12 rounded-xl text-gray-600">
                      <SelectValue placeholder="Mức giá Internet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </div>

          {/* Footer Cố định */}
          <div className="shrink-0 border-t border-gray-100 bg-white p-4 sm:px-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedDirs([])} // Reset nhanh
                className="text-primary border-primary hover:bg-primary/10 h-12 w-28 shrink-0 rounded-xl font-semibold transition-colors"
              >
                Đặt lại
              </Button>
              <Button className="bg-primary hover:bg-primary/90 h-12 flex-1 rounded-xl font-bold text-white shadow-md transition-all">
                Xem kết quả
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
