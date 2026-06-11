import type { FlatUrlContext } from "@/lib/flat-url";
import { normalizeVietnameseText } from "@/lib/text-normalize";
import type { AdvancedFilterValue } from "@/types/filter";
import type { Province, Ward } from "@/types/location";

export type ProvinceWardMap = Record<string, Record<string, string[]>>;

// Merge server lookups and local fallback data into the map consumed by filter UI.
export function buildProvinceWardMap(options: {
  provinces: Province[];
  selectedProvinceId: number | null;
  selectedProvinceWards: Ward[];
  fallbackWards?: Ward[];
}): ProvinceWardMap {
  const { provinces, selectedProvinceId, selectedProvinceWards, fallbackWards } =
    options;

  return provinces.reduce<ProvinceWardMap>((acc, province) => {
    const wardsForProvince =
      selectedProvinceId === province.id
        ? (selectedProvinceWards.length > 0
            ? selectedProvinceWards
            : fallbackWards?.filter((ward) => ward.provinceId === province.id)) ??
          []
        : [];

    acc[province.name] = wardsForProvince.reduce<Record<string, string[]>>(
      (wardAcc, ward) => {
        wardAcc[ward.name] = [];
        return wardAcc;
      },
      {},
    );

    return acc;
  }, {});
}

// Prefer the freshly loaded wards for the currently selected province in the drawer.
export function buildEffectiveProvinceWardMap(
  provinceWardMap: ProvinceWardMap,
  provinceName: string,
  selectedProvinceWards: Ward[],
): ProvinceWardMap {
  if (!provinceName || !selectedProvinceWards.length) {
    return provinceWardMap;
  }

  return {
    ...provinceWardMap,
    [provinceName]: selectedProvinceWards.reduce<Record<string, string[]>>(
      (acc, ward) => {
        acc[ward.name] = [];
        return acc;
      },
      {},
    ),
  };
}

// Build the flat-url lookup context from the same location data used by the filter.
export function buildFlatUrlLocationContext(options: {
  provinces: Province[];
  selectedProvinceWards: Ward[];
  fallbackWards?: Ward[];
}): FlatUrlContext {
  const { provinces, selectedProvinceWards, fallbackWards = [] } = options;
  const wardMap = new Map<string, Pick<Ward, "name" | "slug" | "provinceId">>();

  fallbackWards.forEach((ward) => {
    wardMap.set(`${ward.provinceId}:${ward.slug}`, {
      name: ward.name,
      slug: ward.slug,
      provinceId: ward.provinceId,
    });
  });

  selectedProvinceWards.forEach((ward) => {
    wardMap.set(`${ward.provinceId}:${ward.slug}`, {
      name: ward.name,
      slug: ward.slug,
      provinceId: ward.provinceId,
    });
  });

  return {
    provinces: provinces.map((province) => ({
      id: province.id,
      name: province.name,
      slug: province.slug,
    })),
    wards: Array.from(wardMap.values()),
  };
}

// Snap incoming filter state back to the canonical province and ward labels in the map.
export function reconcileLocationFilter(
  value: AdvancedFilterValue,
  provinceWardMap: ProvinceWardMap,
): AdvancedFilterValue {
  const provinceEntries = Object.keys(provinceWardMap);
  if (!provinceEntries.length) return value;

  const matchedProvince =
    provinceEntries.find(
      (province) =>
        normalizeVietnameseText(province) ===
        normalizeVietnameseText(value.province),
    ) ?? "";

  if (!matchedProvince) {
    return {
      ...value,
      province: "",
      ward: "",
    };
  }

  const wardEntries = Object.keys(provinceWardMap[matchedProvince] ?? {});
  const matchedWard =
    wardEntries.find(
      (ward) =>
        normalizeVietnameseText(ward) === normalizeVietnameseText(value.ward),
    ) ?? "";

  return {
    ...value,
    province: matchedProvince,
    ward: matchedWard,
  };
}
