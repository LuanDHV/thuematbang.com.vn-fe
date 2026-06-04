import AdminListToolbar from "@/components/cms/admin/AdminListToolbar";
import AdminLocationsTable from "@/components/cms/admin/AdminLocationsTable";
import { resolveSearchParamValue } from "@/lib/server-side";
import { locationService } from "@/services/location.service";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export default async function AdminLocationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const searchValue = resolveSearchParamValue(resolvedSearchParams, "q");
  const provinceIdValue = resolveSearchParamValue(
    resolvedSearchParams,
    "provinceId",
  );
  const wardIdValue = resolveSearchParamValue(resolvedSearchParams, "wardId");
  const selectedProvinceId = provinceIdValue ? Number(provinceIdValue) : null;
  const selectedWardId = wardIdValue ? Number(wardIdValue) : null;
  const provinces = await locationService.getProvinces().catch(() => []);

  const filteredProvinces = searchValue
    ? provinces.filter(
        (province) =>
          matchesText(province.name, searchValue) ||
          matchesText(province.slug, searchValue),
      )
    : provinces;

  const selectedProvince =
    selectedProvinceId !== null && Number.isFinite(selectedProvinceId)
      ? (provinces.find((province) => province.id === selectedProvinceId) ??
        null)
      : null;

  const wards = selectedProvince
    ? await locationService.getWards(selectedProvince.id).catch(() => [])
    : [];

  const filteredWards = searchValue
    ? wards.filter(
        (ward) =>
          matchesText(ward.name, searchValue) ||
          matchesText(ward.slug, searchValue),
      )
    : wards;

  const selectedWard =
    selectedWardId !== null && Number.isFinite(selectedWardId)
      ? (filteredWards.find((ward) => ward.id === selectedWardId) ??
        wards.find((ward) => ward.id === selectedWardId) ??
        null)
      : null;

  const streets = selectedWard
    ? await locationService.getStreetsByWard(selectedWard.id).catch(() => [])
    : [];

  const filteredStreets = searchValue
    ? streets.filter(
        (street) =>
          matchesText(street.name, searchValue) ||
          matchesText(street.slug, searchValue),
      )
    : streets;

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
        searchPlaceholder="Tìm kiếm tỉnh, phường hoặc đường"
        createLabel="Tạo mới"
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
