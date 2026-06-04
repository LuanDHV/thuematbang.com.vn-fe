import {
  BED_BATH_OPTIONS,
  DIRECTION_OPTIONS,
  FILTER_LIMITS,
} from "@/constants/filter";
import { Category } from "@/types/category";
import {
  AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";
import { Province, Ward } from "@/types/location";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FlatUrlContext = {
  propertyCategories?: Array<Pick<Category, "name" | "slug">>;
  newsCategories?: Array<Pick<Category, "name" | "slug" | "type">>;
  projectCategories?: Array<Pick<Category, "name" | "slug" | "type">>;
  provinces?: Array<Pick<Province, "name" | "slug">>;
  wards?: Array<Pick<Ward, "name" | "slug">>;
};

const PAGE_SEGMENT_REGEX = /^p([1-9]\d*)$/i;

const AREA_TOKEN_PREFIX = "dien-tich-";
const PRICE_TOKEN_PREFIX = "gia-";
const LOCATION_TOKEN_PREFIX = "khu-vuc-";
const LOCATION_CITY_PREFIX = "tp-";
const LOCATION_WARD_PREFIX = "phuong-";
const BEDROOM_TOKEN_PREFIX = "phong-ngu-";
const BATHROOM_TOKEN_PREFIX = "phong-tam-";
const DIRECTION_TOKEN_PREFIX = "huong-";

const CATEGORY_SLUG_TO_TOKEN = new Map<string, string>([
  ["van-phong", "van-phong"],
  ["mat-bang", "mat-bang"],
  ["kho-xuong", "kho-xuong"],
  ["khu-cong-nghiep", "khu-cong-nghiep"],
  ["can-ho-chung-cu", "can-ho-chung-cu"],
  ["trung-tam-thuong-mai", "trung-tam-thuong-mai"],
  ["nha-tro-phong-tro", "nha-tro-phong-tro"],
]);
const CATEGORY_TOKEN_TO_SLUG = new Map(
  Array.from(CATEGORY_SLUG_TO_TOKEN.entries()).map(([slug, token]) => [
    token,
    slug,
  ]),
);
CATEGORY_TOKEN_TO_SLUG.set("mat-bang", "mat-bang");
const CATEGORY_SLUG_TO_LABEL = new Map<string, string>([
  ["van-phong", "Văn Phòng"],
  ["mat-bang", "Mặt Bằng"],
  ["kho-xuong", "Kho Xưởng"],
  ["khu-cong-nghiep", "Khu Công Nghiệp"],
  ["can-ho-chung-cu", "Căn Hộ, Chung Cư"],
  ["trung-tam-thuong-mai", "Trung Tâm Thương Mại"],
  ["nha-tro-phong-tro", "Nhà Trọ, Phòng Trọ"],
]);

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const compact = (value: string) =>
  normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function humanizeSlug(slug: string) {
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function millionsLabel(value: number) {
  if (value >= 1000) {
    const ty = value / 1000;
    return Number.isInteger(ty)
      ? `${ty}-ty`
      : `${ty.toFixed(1).replace(".", "-")}-ty`;
  }
  return `${value}-trieu`;
}

function buildPriceToken(
  priceMin: string,
  priceMax: string,
  negotiable: boolean,
) {
  if (negotiable) return `${PRICE_TOKEN_PREFIX}thoa-thuan`;
  const min = Number(priceMin || 0) / 1_000_000;
  const max = Number(priceMax || 0) / 1_000_000;
  if (!min && !max) return "";
  if (!min && max) return `${PRICE_TOKEN_PREFIX}duoi-${millionsLabel(max)}`;
  if (min && !max) return `${PRICE_TOKEN_PREFIX}tren-${millionsLabel(min)}`;
  return `${PRICE_TOKEN_PREFIX}${millionsLabel(min)}-${millionsLabel(max)}`;
}

function buildAreaToken(areaMin: string, areaMax: string) {
  const min = Number(areaMin || 0);
  const max = Number(areaMax || 0);
  if (!min && !max) return "";
  if (!min && max) return `${AREA_TOKEN_PREFIX}duoi-${max}m2`;
  if (min && !max) return `${AREA_TOKEN_PREFIX}tren-${min}m2`;
  return `${AREA_TOKEN_PREFIX}${min}-${max}m2`;
}

function buildLocationToken(
  province: string,
  ward: string,
  context?: FlatUrlContext,
) {
  const cityValue = compact(province);
  const citySlugRaw = province
    ? (context?.provinces?.find(
        (cityItem) =>
          compact(cityItem.name) === cityValue ||
          compact(cityItem.slug) === cityValue,
      )?.slug ?? cityValue)
    : "";
  const citySlug = citySlugRaw.replace(/^tp-/, "");
  const cityPart = citySlug ? `${LOCATION_CITY_PREFIX}${citySlug}` : "";
  const wardPart = ward ? `${LOCATION_WARD_PREFIX}${compact(ward)}` : "";
  const parts = [cityPart, wardPart].filter(Boolean);
  if (parts.length === 0) return "";
  return `${LOCATION_TOKEN_PREFIX}${parts.join("-")}`;
}

function bedBathValueToSlug(value: string) {
  return value === "5+" ? "5-plus" : compact(value);
}

function bedBathSlugToValue(value: string) {
  return value === "5-plus" ? "5+" : value;
}

function buildBedroomToken(values: string[]) {
  if (!values.length) return "";
  return `${BEDROOM_TOKEN_PREFIX}${bedBathValueToSlug(values[0])}`;
}

function buildBathroomToken(values: string[]) {
  if (!values.length) return "";
  return `${BATHROOM_TOKEN_PREFIX}${bedBathValueToSlug(values[0])}`;
}

function buildDirectionToken(values: string[]) {
  if (!values.length) return "";
  return `${DIRECTION_TOKEN_PREFIX}${compact(values[0].replaceAll("_", "-"))}`;
}

function removeMatchedSuffix(value: string, token: string) {
  if (value === token) return "";
  if (value.endsWith(`-${token}`)) {
    return value.slice(0, -(token.length + 1));
  }
  return value;
}

function parseSingleListToken(
  pending: string,
  prefix: string,
  pattern: string,
  toValue: (slug: string) => string | undefined,
) {
  const regex = new RegExp(`${prefix}${pattern}$`);
  const match = pending.match(regex);
  if (!match?.[0]) {
    return { pending, value: undefined as string | undefined };
  }

  const slug = match[0].replace(prefix, "");
  const value = toValue(slug);

  return {
    pending: removeMatchedSuffix(pending, match[0]),
    value,
  };
}

function parseLocationToken(pending: string, context?: FlatUrlContext) {
  const locationTokenPattern = new RegExp(
    `${LOCATION_TOKEN_PREFIX}[a-z0-9-]+$`,
  );
  const locationMatch = pending.match(locationTokenPattern);
  if (!locationMatch?.[0]) {
    return {
      pending,
      province: "",
      ward: "",
      street: "",
    };
  }

  const locationRaw = locationMatch[0].replace(LOCATION_TOKEN_PREFIX, "");
  const wardMarker = `-${LOCATION_WARD_PREFIX}`;
  const cityPrefix = LOCATION_CITY_PREFIX;

  let citySlug = "";
  let wardSlug = "";

  if (locationRaw.startsWith(cityPrefix)) {
    const afterCity = locationRaw.slice(cityPrefix.length);
    const wardIndex = afterCity.indexOf(wardMarker);

    if (wardIndex >= 0) {
      citySlug = afterCity.slice(0, wardIndex);
      wardSlug = afterCity.slice(wardIndex + wardMarker.length);
    } else {
      citySlug = afterCity;
    }
  }

  const cityName =
    context?.provinces?.find(
      (item) => compact(item.slug).replace(/^tp-/, "") === citySlug,
    )?.name ?? humanizeSlug(citySlug);

  const wardName =
    context?.wards?.find((item) => compact(item.slug) === wardSlug)?.name ??
    humanizeSlug(wardSlug);

  return {
    pending: removeMatchedSuffix(pending, locationMatch[0]),
    province: citySlug ? cityName : "",
    ward: wardSlug ? wardName : "",
    street: "",
  };
}

type ParsedPrice = {
  minPrice?: number;
  maxPrice?: number;
  isNegotiable?: boolean;
};

type ParsedArea = {
  minArea?: number;
  maxArea?: number;
};

function parseMoneyPartToVnd(value: string): number | undefined {
  const tyMatch = value.match(/^(\d+)(?:-(\d+))?-ty$/);
  if (tyMatch) {
    const decimal = tyMatch[2] ? Number(`0.${tyMatch[2]}`) : 0;
    const amount = (Number(tyMatch[1]) + decimal) * 1_000_000_000;
    return Number.isFinite(amount) ? Math.round(amount) : undefined;
  }

  const trieuMatch = value.match(/^(\d+)(?:-(\d+))?-trieu$/);
  if (trieuMatch) {
    const decimal = trieuMatch[2] ? Number(`0.${trieuMatch[2]}`) : 0;
    const amount = (Number(trieuMatch[1]) + decimal) * 1_000_000;
    return Number.isFinite(amount) ? Math.round(amount) : undefined;
  }

  return undefined;
}

function parsePriceToken(token: string): ParsedPrice | undefined {
  if (token === `${PRICE_TOKEN_PREFIX}thoa-thuan`) {
    return { isNegotiable: true };
  }

  const raw = token.replace(PRICE_TOKEN_PREFIX, "");

  if (raw.startsWith("duoi-")) {
    const max = parseMoneyPartToVnd(raw.replace(/^duoi-/, ""));
    return max ? { maxPrice: max } : undefined;
  }

  if (raw.startsWith("tren-")) {
    const min = parseMoneyPartToVnd(raw.replace(/^tren-/, ""));
    return min ? { minPrice: min } : undefined;
  }

  const moneyPattern = String.raw`\d+(?:-\d+)?-(?:trieu|ty)`;
  const match = raw.match(new RegExp(`^(${moneyPattern})-(${moneyPattern})$`));

  if (!match) return undefined;

  const min = parseMoneyPartToVnd(match[1]);
  const max = parseMoneyPartToVnd(match[2]);

  if (!min || !max) return undefined;

  return {
    minPrice: min,
    maxPrice: max,
  };
}

function parseAreaToken(token: string): ParsedArea | undefined {
  const raw = token.replace(AREA_TOKEN_PREFIX, "");
  const belowMatch = raw.match(/^duoi-(\d+)m2$/);
  if (belowMatch) return { maxArea: Number(belowMatch[1]) };

  const aboveMatch = raw.match(/^tren-(\d+)m2$/);
  if (aboveMatch) return { minArea: Number(aboveMatch[1]) };

  const betweenMatch = raw.match(/^(\d+)-(\d+)m2$/);
  if (betweenMatch) {
    return {
      minArea: Number(betweenMatch[1]),
      maxArea: Number(betweenMatch[2]),
    };
  }

  return undefined;
}

function extractSuffixToken(value: string, prefix: string) {
  const regex = new RegExp(`${prefix}[a-z0-9-]+$`);
  const match = value.match(regex);
  if (!match?.[0]) return undefined;
  return match[0];
}

function findCategorySlugByName(
  name: string,
  categories?: Array<Pick<Category, "name" | "slug">>,
) {
  const target = compact(name);
  const found = categories?.find((item) => compact(item.name) === target);
  return found?.slug;
}

function findCategoryNameBySlug(
  slug: string,
  categories?: Array<Pick<Category, "name" | "slug">>,
) {
  const found = categories?.find(
    (item) => compact(item.slug) === compact(slug),
  );
  return found?.name;
}

export function buildPropertyFilterPath(
  basePath: string,
  value: AdvancedFilterValue,
  context?: FlatUrlContext,
) {
  const tokens: string[] = [];

  const propertyTypeName = value.propertyTypes[0] ?? "";
  if (propertyTypeName) {
    const slug =
      findCategorySlugByName(propertyTypeName, context?.propertyCategories) ??
      compact(propertyTypeName);
    tokens.push(CATEGORY_SLUG_TO_TOKEN.get(slug) ?? slug);
  }

  const priceToken = buildPriceToken(
    value.priceMin,
    value.priceMax,
    value.negotiable,
  );
  if (priceToken) tokens.push(priceToken);

  const areaToken = buildAreaToken(value.areaMin, value.areaMax);
  if (areaToken) tokens.push(areaToken);

  const locationToken = buildLocationToken(value.province, value.ward, context);
  if (locationToken) tokens.push(locationToken);

  const bedroomToken = buildBedroomToken(value.bedrooms);
  if (bedroomToken) tokens.push(bedroomToken);

  const bathroomToken = buildBathroomToken(value.bathrooms);
  if (bathroomToken) tokens.push(bathroomToken);

  const directionToken = buildDirectionToken(value.directions);
  if (directionToken) tokens.push(directionToken);

  if (tokens.length === 0) return basePath;
  return `${basePath}/${tokens.join("-")}`;
}

export function parsePropertyFilterSlug(
  rawSlug: string | undefined,
  context?: FlatUrlContext,
) {
  const initial = { ...INITIAL_ADVANCED_FILTER_VALUE };

  if (!rawSlug) {
    return initial;
  }

  let pending = compact(rawSlug);
  const directionSlugToId = new Map<string, string>(
    DIRECTION_OPTIONS.map((option) => [
      compact(option.id.replaceAll("_", "-")),
      option.id,
    ]),
  );
  const directionSlugPattern = Array.from(directionSlugToId.keys()).join("|");
  const bedBathSinglePattern = `(?:${BED_BATH_OPTIONS.map((value) => bedBathValueToSlug(value)).join("|")})`;

  const directionParsed = parseSingleListToken(
    pending,
    DIRECTION_TOKEN_PREFIX,
    `(?:${directionSlugPattern})`,
    (slug) => directionSlugToId.get(slug),
  );
  pending = directionParsed.pending;
  initial.directions = directionParsed.value ? [directionParsed.value] : [];

  const bathroomParsed = parseSingleListToken(
    pending,
    BATHROOM_TOKEN_PREFIX,
    bedBathSinglePattern,
    bedBathSlugToValue,
  );
  pending = bathroomParsed.pending;
  initial.bathrooms = bathroomParsed.value ? [bathroomParsed.value] : [];

  const bedroomParsed = parseSingleListToken(
    pending,
    BEDROOM_TOKEN_PREFIX,
    bedBathSinglePattern,
    bedBathSlugToValue,
  );
  pending = bedroomParsed.pending;
  initial.bedrooms = bedroomParsed.value ? [bedroomParsed.value] : [];

  const locationParsed = parseLocationToken(pending, context);
  pending = locationParsed.pending;
  initial.province = locationParsed.province;
  initial.ward = locationParsed.ward;
  initial.street = locationParsed.street;

  const areaToken = extractSuffixToken(pending, AREA_TOKEN_PREFIX);
  if (areaToken) {
    const area = parseAreaToken(areaToken);
    if (area) {
      initial.areaMin = area.minArea ? String(area.minArea) : "";
      initial.areaMax = area.maxArea ? String(area.maxArea) : "";
      if (!area.minArea && area.maxArea) {
        initial.areaMin = "";
      }
      pending = removeMatchedSuffix(pending, areaToken);
    }
  }

  const priceToken = extractSuffixToken(pending, PRICE_TOKEN_PREFIX);
  if (priceToken) {
    const price = parsePriceToken(priceToken);
    if (price) {
      initial.priceMin = price.minPrice ? String(price.minPrice) : "";
      initial.priceMax = price.maxPrice ? String(price.maxPrice) : "";
      initial.negotiable = Boolean(price.isNegotiable);
      if (!price.minPrice && price.maxPrice) {
        initial.priceMin = "";
      }
      if (price.minPrice && !price.maxPrice) {
        initial.priceMax = String(FILTER_LIMITS.PRICE_MAX);
      }
      pending = removeMatchedSuffix(pending, priceToken);
    }
  }

  const typeSlug = CATEGORY_TOKEN_TO_SLUG.get(pending) ?? pending;
  const typeName =
    findCategoryNameBySlug(typeSlug, context?.propertyCategories) ??
    CATEGORY_SLUG_TO_LABEL.get(typeSlug) ??
    humanizeSlug(typeSlug);

  if (typeName) {
    initial.propertyTypes = [typeName];
  }

  return initial;
}

export function isLikelyPropertyFilterSlug(rawSlug?: string) {
  if (!rawSlug) return false;
  const slug = compact(rawSlug);

  if (CATEGORY_TOKEN_TO_SLUG.has(slug)) return true;

  const tokenPrefixes = [
    PRICE_TOKEN_PREFIX,
    AREA_TOKEN_PREFIX,
    LOCATION_TOKEN_PREFIX,
    BEDROOM_TOKEN_PREFIX,
    BATHROOM_TOKEN_PREFIX,
    DIRECTION_TOKEN_PREFIX,
  ];

  return tokenPrefixes.some(
    (prefix) => slug.startsWith(prefix) || slug.includes(`-${prefix}`),
  );
}

export function parseNewsCategoryFromSlug(
  slug?: string,
  categories?: Category[],
) {
  if (!slug) return "tin-tuc";
  const source = (categories ?? []).filter((item) => item.type === "NEWS");
  const matched = source.find((item) => item.slug === slug);
  return matched ? matched.slug : "tin-tuc";
}

export function parsePagedSlugSegments(segments?: string[]) {
  if (!segments?.length) {
    return { rawSlug: undefined as string | undefined, page: 1 };
  }

  const last = segments[segments.length - 1];
  const pageMatch = last.match(PAGE_SEGMENT_REGEX);
  const page = pageMatch ? Number(pageMatch[1]) : 1;
  const core = pageMatch ? segments.slice(0, -1) : segments;
  const rawSlug = core.length > 0 ? core.join("-") : undefined;

  return {
    rawSlug,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function buildPagedPath(basePath: string, page: number) {
  const normalizedBase = basePath.replace(/\/+$/, "");
  if (page <= 1) return normalizedBase || "/";
  return `${normalizedBase}/p${page}`;
}

export function parseProjectCategoryFromSlug(
  slug?: string,
  categories?: Category[],
) {
  if (!slug) return "du-an";
  const source = (categories ?? []).filter((item) => item.type === "PROJECT");
  if (!source.length) {
    return slug;
  }
  const matched = source.find((item) => item.slug === slug);
  return matched ? matched.slug : "du-an";
}

export function buildNewsCategoryBreadcrumbs(
  slug?: string,
  categories?: Category[],
) {
  const categorySlug = parseNewsCategoryFromSlug(slug, categories);
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/tin-tuc" },
  ];

  if (categorySlug !== "tin-tuc") {
    const category = (categories ?? [])
      .filter((item) => item.type === "NEWS")
      .find((item) => item.slug === categorySlug);

    items.push({ label: category?.name ?? humanizeSlug(categorySlug) });
  }

  return items;
}

export function buildProjectCategoryBreadcrumbs(
  slug?: string,
  categories?: Category[],
) {
  const categorySlug = parseProjectCategoryFromSlug(slug, categories);
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/du-an" },
  ];

  if (categorySlug !== "du-an") {
    const category = (categories ?? [])
      .filter((item) => item.type === "PROJECT")
      .find((item) => item.slug === categorySlug);

    items.push({ label: category?.name ?? humanizeSlug(categorySlug) });
  }

  return items;
}

function formatVndLabel(value: string) {
  const amount = Number(value || 0);
  if (!amount) return "";

  if (amount >= 1_000_000_000) {
    const ty = amount / 1_000_000_000;
    return `${Number.isInteger(ty) ? ty : ty.toFixed(1)} tỷ`;
  }

  const trieu = Math.round(amount / 1_000_000);
  return `${trieu} triệu`;
}

function formatAreaLabel(value: string) {
  const amount = Number(value || 0);
  if (!amount) return "";
  return `${amount}m2`;
}

export function buildPropertyFilterBreadcrumbs(
  basePath: "/cho-thue" | "/can-thue",
  rawSlug?: string,
  context?: FlatUrlContext,
) {
  const rootLabel = basePath === "/cho-thue" ? "Cho thuê" : "Cần thuê";
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: rootLabel, href: basePath },
  ];

  if (!rawSlug) {
    return items;
  }

  const parsed = parsePropertyFilterSlug(rawSlug, context);

  if (parsed.propertyTypes[0]) {
    items.push({ label: parsed.propertyTypes[0] });
  }

  if (parsed.negotiable) {
    items.push({ label: "Giá thỏa thuận" });
  } else if (parsed.priceMin || parsed.priceMax) {
    const min = formatVndLabel(parsed.priceMin);
    const max = formatVndLabel(parsed.priceMax);

    if (min && max) {
      items.push({ label: `Giá ${min} - ${max}` });
    } else if (min) {
      items.push({ label: `Giá từ ${min}` });
    } else if (max) {
      items.push({ label: `Giá dưới ${max}` });
    }
  }

  if (parsed.areaMin || parsed.areaMax) {
    const min = formatAreaLabel(parsed.areaMin);
    const max = formatAreaLabel(parsed.areaMax);

    if (min && max) {
      items.push({ label: `Diện tích ${min} - ${max}` });
    } else if (min) {
      items.push({ label: `Diện tích từ ${min}` });
    } else if (max) {
      items.push({ label: `Diện tích dưới ${max}` });
    }
  }

  const locationLabel = [parsed.province, parsed.ward, parsed.street]
    .filter(Boolean)
    .join(", ");
  if (locationLabel) {
    items.push({ label: locationLabel });
  }

  if (parsed.bedrooms.length > 0) {
    items.push({ label: `${parsed.bedrooms[0]} Phòng ngủ` });
  }

  if (parsed.bathrooms.length > 0) {
    items.push({ label: `${parsed.bathrooms[0]} Phòng tắm` });
  }

  if (parsed.directions.length > 0) {
    const directionLabels = parsed.directions
      .map(
        (id) =>
          DIRECTION_OPTIONS.find((option) => option.id === id)?.label ?? id,
      )
      .join(", ");
    items.push({ label: `Hướng ${directionLabels}` });
  }

  return items;
}
