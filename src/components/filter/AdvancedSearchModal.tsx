"use client";

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
import { Filter, MapPin } from "lucide-react";

export function AdvancedSearchModal({
  filterCount = 0,
}: {
  filterCount?: number;
}) {
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

      <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-3xl bg-white p-0">
        <DialogHeader className="border-b border-gray-100 p-4">
          <DialogTitle className="text-center text-lg font-bold text-gray-800">
            Bộ lọc
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="thue"
          className="flex h-[70vh] w-full flex-col sm:h-150"
        >
          <div className="px-6 pt-4">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-gray-100 p-1">
              <TabsTrigger
                value="mua"
                className="data-[state=active]:bg-primary rounded-lg text-sm font-semibold transition-all data-[state=active]:text-white"
              >
                TÌM MUA
              </TabsTrigger>
              <TabsTrigger
                value="thue"
                className="data-[state=active]:bg-primary rounded-lg text-sm font-semibold transition-all data-[state=active]:text-white"
              >
                TÌM THUÊ
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            {/* TAB: TÌM THUÊ */}
            <TabsContent value="thue" className="mt-0 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Khu vực & Dự án
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2.5">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Chọn Phường/Xã, Quận/Huyện..."
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Nội thất
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Đầy đủ", "Cơ bản", "Không nội thất"].map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      className="hover:border-primary hover:text-primary h-8 rounded-full text-xs"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Tiện ích & Chi phí (Đặc thù thuê)
                </label>
                <div className="grid gap-3">
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Mức giá điện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nha-nuoc">Giá nhà nước</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Mức giá nước" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Mức giá Internet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Miễn phí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* TAB: TÌM MUA */}
            <TabsContent value="mua" className="mt-0 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Loại hình BĐS
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="border-primary text-primary h-8 rounded-full border-dashed bg-orange-50 text-xs"
                  >
                    + Thêm
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary bg-primary/10 text-primary h-8 rounded-full text-xs"
                  >
                    Căn hộ
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Thông số phòng
                </label>
                <div className="flex gap-2">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="hover:border-primary hover:bg-primary h-10 w-10 rounded-full hover:text-white"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mockup Bánh xe hướng (Wheel UI) */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Hướng nhà
                </label>
                <div className="flex items-center justify-center py-6">
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-4 border-gray-100 bg-gray-50">
                    <span className="absolute top-2 text-xs font-medium text-gray-400">
                      Bắc
                    </span>
                    <span className="absolute bottom-2 text-xs font-medium text-gray-400">
                      Nam
                    </span>
                    <span className="absolute left-2 text-xs font-medium text-gray-400">
                      Tây
                    </span>
                    <span className="absolute right-2 text-xs font-medium text-gray-400">
                      Đông
                    </span>
                    <div className="z-10 h-16 w-16 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>

          <div className="flex gap-3 border-t border-gray-100 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <Button
              variant="outline"
              className="border-primary text-primary hover:border-primary hover:bg-primary/10 h-10 cursor-pointer rounded-lg border bg-transparent px-4 text-xs font-medium tracking-wider uppercase"
            >
              Đặt lại
            </Button>

            <Button className="bg-primary hover:bg-primary/90 h-10 flex-2 cursor-pointer rounded-xl font-semibold text-white shadow-lg shadow-orange-100">
              Xem kết quả
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
