import { DIRECTION_OPTIONS, FILTER_LIMITS } from "@/constants/filter";
import { compactSlugToken, humanizeSlugToken } from "@/lib/text/text-normalize";
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
  provinces?: Array<Pick<Province, "id" | "name" | "slug">>;
  wards?: Array<Pick<Ward, "name" | "slug" | "provinceId">>;
};

export type FlatUrlRouteParts = {
  categorySlug?: string;
  provinceSlug?: string;
  wardSlug?: string;
};

// Keep these prefixes centralized so parsing and building stay symmetrical.
const PAGE_SEGMENT_REGEX = /^p([1-9]\d*)$/i;

const AREA_TOKEN_PREFIX = "dt-";
const PRICE_TOKEN_PREFIX = "gia-";
const LOCATION_PROVINCE_PREFIX = "tp-";
const LOCATION_WARD_PREFIX = "phuong-";
const BEDROOM_TOKEN_SUFFIX = "pn";
const BATHROOM_TOKEN_SUFFIX = "pt";
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

// Token builders must stay lightweight because both listing routes and suggestion
// navigation depend on the same slug contract.
function millionsLabel(value: number) {
  if (value >= 1000) {
    const ty = value / 1000;
    return Number.isInteger(ty)
      ? `${ty}-ty`
      : `${ty.toFixed(1).replace(".", "-")}-ty`;
  }
  return `${value}-trieu`;
}

// Build the price segment used by the flat listing URL contract.
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

function splitListingSlugBlocks(rawSlug?: string) {
  if (!rawSlug) return [];
  return rawSlug
    .replace(/%2F/gi, "/")
    .split("/")
    .map((segment) => compactSlugToken(segment))
    .filter(Boolean);
}

// Build the area segment used by the flat listing URL contract.
function buildAreaToken(areaMin: string, areaMax: string) {
  const min = Number(areaMin || 0);
  const max = Number(areaMax || 0);
  if (!min && !max) return "";
  if (!min && max) return `${AREA_TOKEN_PREFIX}duoi-${max}m2`;
  if (min && !max) return `${AREA_TOKEN_PREFIX}tren-${min}m2`;
  return `${AREA_TOKEN_PREFIX}tu-${min}m2-den-${max}m2`;
}

// Resolve province and ward labels into the canonical location token for the URL.
function buildLocationToken(
  province: string,
  ward: string,
  context?: FlatUrlContext,
) {
  const provinceValue = compactSlugToken(province);
  const matchedProvince = province
    ? context?.provinces?.find(
        (provinceItem) =>
          compactSlugToken(provinceItem.name) === provinceValue ||
          compactSlugToken(provinceItem.slug).replace(/^tp-/, "") ===
            provinceValue,
      )
    : undefined;
  const provinceSlugRaw = matchedProvince?.slug ?? provinceValue;
  const provinceSlug = provinceSlugRaw.replace(/^tp-/, "");
  const provincePart = provinceSlug
    ? `${LOCATION_PROVINCE_PREFIX}${provinceSlug}`
    : "";
  const wardValue = compactSlugToken(ward);
  const matchedWard = ward
    ? context?.wards?.find(
        (wardItem) =>
          (compactSlugToken(wardItem.name) === wardValue ||
            compactSlugToken(wardItem.slug) === wardValue) &&
          (!matchedProvince || wardItem.provinceId === matchedProvince.id),
      )
    : undefined;
  const wardSlug = matchedWard?.slug ?? wardValue;
  const wardPart = wardSlug ? `${LOCATION_WARD_PREFIX}${wardSlug}` : "";
  const parts = [provincePart, wardPart].filter(Boolean);
  if (parts.length === 0) return "";
  return parts.join("-");
}

// Rebuild the location token directly from parsed route parts when suggestions supply them.
function buildLocationTokenFromRouteParts(routeParts: FlatUrlRouteParts) {
  if (!routeParts.provinceSlug) return "";

  const provinceSlug = routeParts.provinceSlug.replace(/^tp-/, "");
  const wardSlug = routeParts.wardSlug?.replace(/^phuong-/, "");

  const parts = [`${LOCATION_PROVINCE_PREFIX}${provinceSlug}`];
  if (wardSlug) {
    parts.push(`${LOCATION_WARD_PREFIX}${wardSlug}`);
  }

  return parts.join("-");
}

// Build the direction token from the selected filter option id.
function buildDirectionToken(values: string[]) {
  if (!values.length) return "";
  return `${DIRECTION_TOKEN_PREFIX}${compactSlugToken(values[0].replaceAll("_", "-"))}`;
}

// Normalize bedroom and bathroom values into the slug format used by the route.
function bedBathValueToSlug(value: string) {
  const normalized = compactSlugToken(value);
  if (!normalized) return "";
  return normalized === "5+" ? `5${BEDROOM_TOKEN_SUFFIX}` : `${normalized}${BEDROOM_TOKEN_SUFFIX}`;
}

// Build the bedroom token when the filter has a selected value.
function buildBedroomToken(values: string[]) {
  if (!values.length) return "";
  const token = bedBathValueToSlug(values[0]);
  return token ? token : "";
}

// Build the bathroom token when the filter has a selected value.
function buildBathroomToken(values: string[]) {
  if (!values.length) return "";
  const token = bedBathValueToSlug(values[0]).replace(
    BEDROOM_TOKEN_SUFFIX,
    BATHROOM_TOKEN_SUFFIX,
  );
  return token ? token : "";
}

// Remove one parsed token from the pending slug without disturbing earlier tokens.
function removeMatchedSuffix(value: string, token: string) {
  if (value === token) return "";
  if (value.endsWith(`-${token}`)) {
    return value.slice(0, -(token.length + 1));
  }
  return value;
}

function parseLocationBlock(
  block?: string,
  context?: FlatUrlContext,
): {
  categorySlug?: string;
  provinceSlug?: string;
  wardSlug?: string;
  province: string;
  ward: string;
} {
  if (!block) {
    return {
      province: "",
      ward: "",
    };
  }

  const pending = compactSlugToken(block);
  const locationTokenPattern =
    `(?:${LOCATION_PROVINCE_PREFIX}[a-z0-9-]+(?:-${LOCATION_WARD_PREFIX}[a-z0-9-]+)?)`;
  const locationToken = extractTrailingToken(pending, locationTokenPattern);

  let categorySlug = pending || undefined;
  let provinceSlug = "";
  let wardSlug = "";

  if (locationToken) {
    const nextPending = removeMatchedSuffix(pending, locationToken);
    categorySlug = nextPending || undefined;

    const locationRaw = locationToken;
    const wardMarker = `-${LOCATION_WARD_PREFIX}`;

    if (locationRaw.startsWith(LOCATION_PROVINCE_PREFIX)) {
      const afterProvince = locationRaw.slice(LOCATION_PROVINCE_PREFIX.length);
      const wardIndex = afterProvince.indexOf(wardMarker);

      if (wardIndex >= 0) {
        provinceSlug = afterProvince.slice(0, wardIndex);
        wardSlug = afterProvince.slice(wardIndex + wardMarker.length);
      } else {
        provinceSlug = afterProvince;
      }
    }
  }

  const provinceName =
    context?.provinces?.find(
      (item) =>
        compactSlugToken(item.slug).replace(/^tp-/, "") === provinceSlug,
    )?.name ?? humanizeSlugToken(provinceSlug);

  const wardName =
    context?.wards?.find((item) => {
      if (compactSlugToken(item.slug) !== wardSlug) return false;

      if (!provinceSlug) return true;

      const wardProvince = context?.provinces?.find(
        (province) =>
          province.id === item.provinceId &&
          compactSlugToken(province.slug).replace(/^tp-/, "") === provinceSlug,
      );

      return Boolean(wardProvince);
    })?.name ?? humanizeSlugToken(wardSlug);

  return {
    categorySlug,
    provinceSlug: provinceSlug || undefined,
    wardSlug: wardSlug || undefined,
    province: provinceSlug ? provinceName : "",
    ward: wardSlug ? wardName : "",
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

// Parse one money segment into VND for both single-sided and between ranges.
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

// Parse the price token back into the filter fields used by the toolbar.
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

// Parse the area token back into the filter fields used by the toolbar.
function parseAreaToken(token: string): ParsedArea | undefined {
  const raw = token.replace(AREA_TOKEN_PREFIX, "");
  const belowMatch = raw.match(/^duoi-(\d+)m2$/);
  if (belowMatch) return { maxArea: Number(belowMatch[1]) };

  const aboveMatch = raw.match(/^tren-(\d+)m2$/);
  if (aboveMatch) return { minArea: Number(aboveMatch[1]) };

  const betweenMatch = raw.match(/^tu-(\d+)m2-den-(\d+)m2$/);
  if (betweenMatch) {
    return {
      minArea: Number(betweenMatch[1]),
      maxArea: Number(betweenMatch[2]),
    };
  }

  return undefined;
}

function extractTrailingToken(value: string, tokenPattern: string) {
  const regex = new RegExp(`(?:^|-)(${tokenPattern})$`);
  const match = value.match(regex);
  if (!match?.[1]) return undefined;
  return match[1];
}

// Resolve a category label into the slug used by the flat-url contract.
function findCategorySlugByName(
  name: string,
  categories?: Array<Pick<Category, "name" | "slug">>,
) {
  const target = compactSlugToken(name);
  const found = categories?.find(
    (item) => compactSlugToken(item.name) === target,
  );
  return found?.slug;
}

// Resolve a category slug back to the preferred display label when rebuilding state.
function findCategoryNameBySlug(
  slug: string,
  categories?: Array<Pick<Category, "name" | "slug">>,
) {
  const found = categories?.find(
    (item) => compactSlugToken(item.slug) === compactSlugToken(slug),
  );
  return found?.name;
}

function buildCanonicalListingBlock1(
  value: AdvancedFilterValue | FlatUrlRouteParts,
  context?: FlatUrlContext,
) {
  const parts: string[] = [];

  if ("propertyTypes" in value) {
    const propertyTypeName = value.propertyTypes[0] ?? "";
    if (propertyTypeName) {
      const slug =
        findCategorySlugByName(propertyTypeName, context?.propertyCategories) ??
        compactSlugToken(propertyTypeName);
      parts.push(CATEGORY_SLUG_TO_TOKEN.get(slug) ?? slug);
    }
  } else if (value.categorySlug) {
    parts.push(value.categorySlug);
  }

  const locationToken =
    "provinceSlug" in value
      ? buildLocationTokenFromRouteParts(value)
      : buildLocationToken(
          "province" in value ? value.province : "",
          "ward" in value ? value.ward : "",
          context,
        );

  if (locationToken) {
    parts.push(locationToken);
  }

  return parts.filter(Boolean).join("-");
}

function buildCanonicalListingBlock2(value: AdvancedFilterValue) {
  const parts: string[] = [];

  const priceToken = buildPriceToken(
    value.priceMin,
    value.priceMax,
    value.negotiable,
  );
  if (priceToken) parts.push(priceToken);

  const areaToken = buildAreaToken(value.areaMin, value.areaMax);
  if (areaToken) parts.push(areaToken);

  const bedroomToken = buildBedroomToken(value.bedrooms);
  if (bedroomToken) parts.push(bedroomToken);

  const bathroomToken = buildBathroomToken(value.bathrooms);
  if (bathroomToken) parts.push(bathroomToken);

  const directionToken = buildDirectionToken(value.directions);
  if (directionToken) parts.push(directionToken);

  return parts.filter(Boolean).join("-");
}

// Builders feed both manual filter interactions and suggestion navigation, so
// they must avoid introducing default placeholder tokens into the slug.
export function buildPropertyFilterPath(
  basePath: string,
  value: AdvancedFilterValue,
  context?: FlatUrlContext,
) {
  const block1 = buildCanonicalListingBlock1(value, context);
  const block2 = buildCanonicalListingBlock2(value);
  const blocks = [block1, block2].filter(Boolean);

  if (blocks.length === 0) return basePath;
  return `${basePath}/${blocks.join("/")}`;
}

// Rebuild a listing path from route parts that already came from the backend contract.
export function buildPropertyFilterPathFromRouteParts(
  basePath: string,
  routeParts: FlatUrlRouteParts,
) {
  const block1 = buildCanonicalListingBlock1(routeParts);

  if (!block1) {
    return basePath;
  }

  return `${basePath}/${block1}`;
}

// Extract category and location route parts without expanding the full filter state.
export function extractPropertyFilterRouteParts(
  rawSlug?: string,
): FlatUrlRouteParts {
  if (!rawSlug) {
    return {};
  }

  const [block1] = splitListingSlugBlocks(rawSlug);
  if (block1 && isFilterBlock(block1)) {
    return {};
  }
  const parsed = parseLocationBlock(block1);

  return {
    categorySlug:
      (CATEGORY_TOKEN_TO_SLUG.get(parsed.categorySlug ?? "") ??
        parsed.categorySlug) || undefined,
    provinceSlug: parsed.provinceSlug,
    wardSlug: parsed.wardSlug,
  };
}

function parseBedBathToken(
  pending: string,
  suffix: typeof BEDROOM_TOKEN_SUFFIX | typeof BATHROOM_TOKEN_SUFFIX,
) {
  const token = extractTrailingToken(pending, `\\d+${suffix}`);
  if (!token) {
    return { pending, value: undefined as string | undefined };
  }

  const number = Number(token.replace(suffix, ""));
  if (!Number.isFinite(number)) {
    return { pending, value: undefined as string | undefined };
  }

  return {
    pending: removeMatchedSuffix(pending, token),
    value: number >= 5 ? "5+" : String(number),
  };
}

function isFilterBlock(block: string) {
  return (
    block.startsWith(PRICE_TOKEN_PREFIX) ||
    block.startsWith(AREA_TOKEN_PREFIX) ||
    block.startsWith(DIRECTION_TOKEN_PREFIX) ||
    /^\d+pn$/.test(block) ||
    /^\d+pt$/.test(block)
  );
}

// Parsing removes recognized suffix tokens from the filter block so the first
// block can remain dedicated to category and location.
export function parsePropertyFilterSlug(
  rawSlug: string | undefined,
  context?: FlatUrlContext,
) {
  const initial = { ...INITIAL_ADVANCED_FILTER_VALUE };

  if (!rawSlug) {
    return initial;
  }

  let [block1, block2] = splitListingSlugBlocks(rawSlug);
  if (!block2 && block1 && isFilterBlock(block1)) {
    block2 = block1;
    block1 = "";
  }

  const locationParsed = parseLocationBlock(block1, context);
  let pending = block2 ?? "";
  const directionSlugToId = new Map<string, string>(
    DIRECTION_OPTIONS.map((option) => [
      compactSlugToken(option.id.replaceAll("_", "-")),
      option.id,
    ]),
  );
  const directionSlugPattern = Array.from(directionSlugToId.keys()).join("|");

  const directionToken = extractTrailingToken(
    pending,
    `${DIRECTION_TOKEN_PREFIX}(?:${directionSlugPattern})`,
  );
  if (directionToken) {
    const directionSlug = directionToken.replace(DIRECTION_TOKEN_PREFIX, "");
    const directionId = directionSlugToId.get(directionSlug);
    if (directionId) {
      initial.directions = [directionId];
      pending = removeMatchedSuffix(pending, directionToken);
    }
  }

  const bathroomToken = extractTrailingToken(
    pending,
    `\\d+${BATHROOM_TOKEN_SUFFIX}`,
  );
  if (bathroomToken) {
    const bathroom = parseBedBathToken(pending, BATHROOM_TOKEN_SUFFIX);
    pending = bathroom.pending;
    initial.bathrooms = bathroom.value ? [bathroom.value] : [];
  }

  const bedroomToken = extractTrailingToken(
    pending,
    `\\d+${BEDROOM_TOKEN_SUFFIX}`,
  );
  if (bedroomToken) {
    const bedroom = parseBedBathToken(pending, BEDROOM_TOKEN_SUFFIX);
    pending = bedroom.pending;
    initial.bedrooms = bedroom.value ? [bedroom.value] : [];
  }

  initial.province = locationParsed.province;
  initial.ward = locationParsed.ward;

  const areaToken = extractTrailingToken(
    pending,
    `${AREA_TOKEN_PREFIX}(?:duoi-\\d+m2|tren-\\d+m2|tu-\\d+m2-den-\\d+m2)`,
  );
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

  const moneyPattern = String.raw`\d+(?:-\d+)?-(?:trieu|ty)`;
  const priceToken = extractTrailingToken(
    pending,
    `${PRICE_TOKEN_PREFIX}(?:thoa-thuan|duoi-${moneyPattern}|tren-${moneyPattern}|${moneyPattern}-${moneyPattern})`,
  );
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

  const typeSlug = locationParsed.categorySlug ?? pending;
  const normalizedTypeSlug = CATEGORY_TOKEN_TO_SLUG.get(typeSlug) ?? typeSlug;
  const typeName =
    findCategoryNameBySlug(normalizedTypeSlug, context?.propertyCategories) ??
    CATEGORY_SLUG_TO_LABEL.get(normalizedTypeSlug) ??
    humanizeSlugToken(normalizedTypeSlug);

  if (typeName) {
    initial.propertyTypes = [typeName];
  }

  return initial;
}

// Detect whether a slug contains filter tokens before route code treats it as a detail slug.
export function isLikelyPropertyFilterSlug(rawSlug?: string) {
  if (!rawSlug) return false;
  if (rawSlug.includes("/")) return true;

  const [block1, block2] = splitListingSlugBlocks(rawSlug);
  if (CATEGORY_TOKEN_TO_SLUG.has(block1 ?? "")) return true;

  const tokenPrefixes = [
    PRICE_TOKEN_PREFIX,
    AREA_TOKEN_PREFIX,
    LOCATION_PROVINCE_PREFIX,
    LOCATION_WARD_PREFIX,
    BEDROOM_TOKEN_SUFFIX,
    BATHROOM_TOKEN_SUFFIX,
    DIRECTION_TOKEN_PREFIX,
  ];

  return (
    tokenPrefixes.some(
      (prefix) => (block1 ?? "").startsWith(prefix) || (block1 ?? "").includes(`-${prefix}`),
    ) || Boolean(block2)
  );
}

// Keep news category parsing tolerant when a slug does not match the current dataset.
export function parseNewsCategoryFromSlug(
  slug?: string,
  categories?: Category[],
) {
  if (!slug) return "tin-tuc";
  const source = (categories ?? []).filter((item) => item.type === "NEWS");
  const matched = source.find((item) => item.slug === slug);
  return matched ? matched.slug : "tin-tuc";
}

// Separate pagination suffixes from the core flat slug so route parsing stays stable.
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

// Separate pagination suffixes from the canonical listing slug while preserving slash boundaries.
export function parseListingPagedSlugSegments(segments?: string[]) {
  if (!segments?.length) {
    return { rawSlug: undefined as string | undefined, page: 1 };
  }

  const last = segments[segments.length - 1];
  const pageMatch = last.match(PAGE_SEGMENT_REGEX);
  const page = pageMatch ? Number(pageMatch[1]) : 1;
  const core = pageMatch ? segments.slice(0, -1) : segments;
  const rawSlug = core.length > 0 ? core.join("/") : undefined;

  return {
    rawSlug,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

// Append the canonical page segment only when the page is greater than one.
export function buildPagedPath(basePath: string, page: number) {
  const normalizedBase = basePath.replace(/\/+$/, "");
  if (page <= 1) return normalizedBase || "/";
  return `${normalizedBase}/p${page}`;
}

// Keep project category parsing tolerant when a slug does not match the current dataset.
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

// Build the breadcrumb trail for the news listing hierarchy.
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

    items.push({ label: category?.name ?? humanizeSlugToken(categorySlug) });
  }

  return items;
}

// Build the breadcrumb trail for the project listing hierarchy.
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

    items.push({ label: category?.name ?? humanizeSlugToken(categorySlug) });
  }

  return items;
}

// Format one VND value into the short breadcrumb label variant.
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

// Format one area value into the short breadcrumb label variant.
function formatAreaLabel(value: string) {
  const amount = Number(value || 0);
  if (!amount) return "";
  return `${amount}m2`;
}

// Breadcrumb labels are derived from parsed filter state so page shells and
// suggestion links always describe the same canonical slug.
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

  const locationLabel = [parsed.province, parsed.ward]
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
