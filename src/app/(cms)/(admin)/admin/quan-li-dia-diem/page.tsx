import AdminLocationsTable from "@/components/cms/admin/AdminLocationsTable";
import {
  resolveSearchQueryValue,
  resolveSearchParamValue,
} from "@/lib/server-side";
import { locationService } from "@/services/location.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLocationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const searchQuery = resolveSearchQueryValue(resolvedSearchParams);
  const provinceIdValue = resolveSearchParamValue(
    resolvedSearchParams,
    "provinceId",
  );
  const selectedProvinceId = provinceIdValue ? Number(provinceIdValue) : null;
  const provinces = await locationService.getProvinces().catch(() => []);

  const filteredProvinces = searchQuery
    ? await locationService
        .getProvinces({ filters: { q: searchQuery } })
        .catch(() => [])
    : provinces;

  const selectedProvince =
    selectedProvinceId !== null && Number.isFinite(selectedProvinceId)
      ? (provinces.find((province) => province.id === selectedProvinceId) ??
        null)
      : null;

  const wards = selectedProvince
    ? await locationService
        .getWards({ provinceId: selectedProvince.id })
        .catch(() => [])
    : [];

  const filteredWards = selectedProvince
    ? searchQuery
      ? await locationService
          .getWards({
            provinceId: selectedProvince.id,
            filters: { q: searchQuery },
          })
          .catch(() => [])
      : wards
    : [];

  return (
    <section className="space-y-5">
      <AdminLocationsTable
        provinces={filteredProvinces}
        wards={filteredWards}
        selectedProvince={selectedProvince}
        selectedWard={null}
        searchValue={searchValue}
        toolbar={{
          title: "Quản lí địa điểm",
          searchPlaceholder: "Tìm kiếm theo tên",
          searchValue,
          actionLabel: "Tạo mới",
        }}
      />
    </section>
  );
}
