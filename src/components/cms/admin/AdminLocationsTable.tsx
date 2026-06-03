import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Province, Street, Ward } from "@/types/location";

type AdminLocationsTableProps = {
  provinces: Province[];
  wards: Ward[];
  streets: Street[];
  selectedProvince?: Province | null;
};

function formatSelectedProvince(province?: Province | null) {
  return province ? `${province.name} (#${province.id})` : "Tất cả";
}

export default function AdminLocationsTable({
  provinces,
  wards,
  streets,
  selectedProvince,
}: AdminLocationsTableProps) {
  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Địa điểm lookup
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Hiển thị raw data tỉnh/thành, phường/xã và đường phố để kiểm tra
                seed và dữ liệu selector.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{provinces.length} tỉnh/thành</Badge>
              <Badge variant="outline">{wards.length} phường/xã</Badge>
              <Badge variant="outline">{streets.length} đường phố</Badge>
              <Badge variant="secondary">
                Đang xem: {formatSelectedProvince(selectedProvince)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-4 md:p-5">
          <div className="surface-card overflow-hidden">
            <div className="border-hairline border-b px-4 py-3">
              <h3 className="text-heading text-base font-semibold">
                Tỉnh / Thành phố
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[12%]">ID</TableHead>
                  <TableHead className="w-[44%]">Tên</TableHead>
                  <TableHead className="w-[44%]">Slug</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {provinces.length > 0 ? (
                  provinces.map((province) => (
                    <TableRow key={province.id}>
                      <TableCell className="align-top">
                        <span className="text-body text-sm font-medium">
                          {province.id}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <span className="text-heading text-sm font-semibold">
                          {province.name}
                        </span>
                      </TableCell>
                      <TableCell className="align-top">
                        <span className="text-body text-sm">{province.slug}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center">
                      <p className="text-secondary text-sm">
                        Không có dữ liệu tỉnh/thành.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="surface-card overflow-hidden">
              <div className="border-hairline border-b px-4 py-3">
                <h3 className="text-heading text-base font-semibold">
                  Phường / Xã
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[16%]">ID</TableHead>
                    <TableHead className="w-[42%]">Tên</TableHead>
                    <TableHead className="w-[42%]">Slug</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wards.length > 0 ? (
                    wards.map((ward) => (
                      <TableRow key={ward.id}>
                        <TableCell className="align-top">
                          <span className="text-body text-sm font-medium">
                            {ward.id}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="text-heading text-sm font-semibold">
                              {ward.name}
                            </p>
                            <p className="text-secondary text-xs">
                              Tỉnh ID: {ward.provinceId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className="text-body text-sm">{ward.slug}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="py-10 text-center">
                        <p className="text-secondary text-sm">
                          Không có dữ liệu phường/xã.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="surface-card overflow-hidden">
              <div className="border-hairline border-b px-4 py-3">
                <h3 className="text-heading text-base font-semibold">
                  Đường phố
                </h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[16%]">ID</TableHead>
                    <TableHead className="w-[42%]">Tên</TableHead>
                    <TableHead className="w-[42%]">Slug</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streets.length > 0 ? (
                    streets.map((street) => (
                      <TableRow key={street.id}>
                        <TableCell className="align-top">
                          <span className="text-body text-sm font-medium">
                            {street.id}
                          </span>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="space-y-1">
                            <p className="text-heading text-sm font-semibold">
                              {street.name}
                            </p>
                            <p className="text-secondary text-xs">
                              Tỉnh ID: {street.provinceId}
                              {street.wardId ? ` · Phường ID: ${street.wardId}` : ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <span className="text-body text-sm">{street.slug}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="py-10 text-center">
                        <p className="text-secondary text-sm">
                          Không có dữ liệu đường phố.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
