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
  const provinces = await locationService.getProvinces().catch(() => []);

  const filteredProvinces = searchValue
    ? provinces.filter(
        (province) =>
          matchesText(province.name, searchValue) ||
          matchesText(province.slug, searchValue),
      )
    : provinces;

  const selectedProvince =
    filteredProvinces[0] ?? (searchValue ? null : (provinces[0] ?? null));
  const wards = await locationService
    .getWards(selectedProvince?.id)
    .catch(() => []);
  const streets = await locationService
    .getStreetsByProvince(selectedProvince?.id)
    .catch(() => []);

  const filteredWards = searchValue
    ? wards.filter(
        (ward) =>
          matchesText(ward.name, searchValue) ||
          matchesText(ward.slug, searchValue),
      )
    : wards;

  const filteredStreets = searchValue
    ? streets.filter(
        (street) =>
          matchesText(street.name, searchValue) ||
          matchesText(street.slug, searchValue),
      )
    : streets;

  return (
    <section className="space-y-5">
      <AdminListToolbar
        eyebrow="CMS Admin"
        title="Quản lý địa điểm"
        description="Dữ liệu lookup raw từ provinces, wards và streets để kiểm tra cấu trúc địa giới."
        searchPlaceholder="Tìm kiếm tỉnh, phường hoặc đường"
        createLabel="Tạo mới"
        searchValue={searchValue}
      />

      <AdminLocationsTable
        provinces={filteredProvinces}
        wards={filteredWards}
        streets={filteredStreets}
        selectedProvince={selectedProvince}
      />
    </section>
  );
}
