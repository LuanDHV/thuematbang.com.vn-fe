import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
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
  const wardIdValue = resolveSearchParamValue(resolvedSearchParams, "wardId");
  const selectedProvinceId = provinceIdValue ? Number(provinceIdValue) : null;
  const selectedWardId = wardIdValue ? Number(wardIdValue) : null;
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

  const selectedWard =
    selectedWardId !== null && Number.isFinite(selectedWardId)
      ? (wards.find((ward) => ward.id === selectedWardId) ?? null)
      : null;

  const streets = selectedWard
    ? await locationService
        .getStreetsByWard({ wardId: selectedWard.id })
        .catch(() => [])
    : [];

  const filteredStreets = selectedWard
    ? searchQuery
      ? await locationService
          .getStreetsByWard({
            wardId: selectedWard.id,
            filters: { q: searchQuery },
          })
          .catch(() => [])
      : streets
    : [];

  const hiddenParams = [
    selectedProvince
      ? { name: "provinceId", value: String(selectedProvince.id) }
      : null,
    selectedWard ? { name: "wardId", value: String(selectedWard.id) } : null,
  ].filter((field): field is { name: string; value: string } => Boolean(field));

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="Quản lí địa điểm"
        searchPlaceholder="Tìm kiếm theo tên"
        createLabel="Tạo mới"
        key={searchValue ?? ""}
        searchValue={searchValue}
        hiddenParams={hiddenParams}
      />

      <AdminLocationsTable
        provinces={filteredProvinces}
        wards={filteredWards}
        streets={filteredStreets}
        selectedProvince={selectedProvince}
        selectedWard={selectedWard}
        searchValue={searchValue}
      />
    </section>
  );
}
