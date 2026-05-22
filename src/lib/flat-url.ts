import {
  mockCategoryNews,
  mockCategoryProject,
  mockCategoryProperty,
} from "@/mocks/categories";
import { DIRECTION_OPTIONS, FILTER_LIMITS } from "@/mocks/filter";
import { mockCities, mockStreets, mockWards } from "@/mocks/locations";
import {
  AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

// -----------------------------------------------------------------------------
// Nhóm tiện ích chuẩn hóa chuỗi cho URL
// - normalize: bỏ dấu tiếng Việt, chuyển lowercase, trim
// - compact: chuyển mọi cụm ký tự không hợp lệ thành dấu "-" để tạo slug ổn định
// -----------------------------------------------------------------------------
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

const AREA_TOKEN_PREFIX = "dien-tich-";
const PRICE_TOKEN_PREFIX = "gia-";
const LOCATION_TOKEN_PREFIX = "khu-vuc-";
const LOCATION_CITY_PREFIX = "tp-";
const LOCATION_WARD_PREFIX = "phuong-";
const LOCATION_STREET_PREFIX = "duong-";
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

function millionsLabel(value: number) {
  if (value >= 1000) {
    const ty = value / 1000;
    return Number.isInteger(ty)
      ? `${ty}-ty`
      : `${ty.toFixed(1).replace(".", "-")}-ty`;
  }
  return `${value}-trieu`;
}

// -----------------------------------------------------------------------------
// Nhóm hàm build token (từ state filter -> token gắn vào flat URL)
// Mỗi tiêu chí filter có 1 prefix riêng để parse ngược không bị nhập nhằng.
// -----------------------------------------------------------------------------
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

function buildLocationToken(city: string, ward: string, street: string) {
  const cityValue = compact(city);
  const citySlugRaw = city
    ? (mockCities.find(
        (cityItem) =>
          compact(cityItem.name) === cityValue ||
          compact(cityItem.slug) === cityValue,
      )?.slug ?? cityValue)
    : "";
  const citySlug = citySlugRaw.replace(/^tp-/, "");
  const cityPart = citySlug ? `${LOCATION_CITY_PREFIX}${citySlug}` : "";
  const wardPart = ward ? `${LOCATION_WARD_PREFIX}${compact(ward)}` : "";
  const streetPart = street
    ? `${LOCATION_STREET_PREFIX}${compact(street)}`
    : "";
  const parts = [cityPart, wardPart, streetPart].filter(Boolean);
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

// -----------------------------------------------------------------------------
// Nhóm lookup map phục vụ parse ngược (token -> giá trị hiển thị / id nội bộ)
// Ý tưởng: luôn parse theo slug rồi map về dữ liệu gốc trong mock/options.
// -----------------------------------------------------------------------------
const propertyTypeSlugToName = new Map<string, string>(
  mockCategoryProperty.map((category) => [category.slug, category.name]),
);
for (const category of mockCategoryProperty) {
  const beToken = CATEGORY_SLUG_TO_TOKEN.get(category.slug);
  if (beToken) {
    propertyTypeSlugToName.set(beToken, category.name);
  }
}

const citySlugToName = new Map(
  mockCities.flatMap((city) => {
    const normalizedSlug = compact(city.slug).replace(/^tp-/, "");
    return [
      [compact(city.name), city.name],
      [compact(city.slug), city.name],
      [normalizedSlug, city.name],
    ];
  }),
);
const wardSlugToName = new Map(
  mockWards.map((ward) => [compact(ward.name), ward.name]),
);
const streetSlugToName = new Map(
  mockStreets.map((street) => [compact(street.name), street.name]),
);

const directionSlugToId = new Map<string, string>(
  DIRECTION_OPTIONS.map((option) => [
    compact(option.id.replaceAll("_", "-")),
    option.id,
  ]),
);
const directionSlugPattern = Array.from(directionSlugToId.keys()).join("|");
const bedBathSinglePattern = "(?:1|2|3|4|5-plus)";

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

function parseLocationToken(pending: string) {
  const locationTokenPattern = new RegExp(
    `${LOCATION_TOKEN_PREFIX}[a-z0-9-]+$`,
  );
  const locationMatch = pending.match(locationTokenPattern);
  if (!locationMatch?.[0]) {
    return {
      pending,
      city: "",
      ward: "",
      street: "",
    };
  }

  const locationRaw = locationMatch[0].replace(LOCATION_TOKEN_PREFIX, "");

  const wardMarker = `-${LOCATION_WARD_PREFIX}`;
  const streetMarker = `-${LOCATION_STREET_PREFIX}`;
  const cityPrefix = LOCATION_CITY_PREFIX;

  let citySlug = "";
  let wardSlug = "";
  let streetSlug = "";

  if (locationRaw.startsWith(cityPrefix)) {
    const afterCity = locationRaw.slice(cityPrefix.length);
    const wardIndex = afterCity.indexOf(wardMarker);
    const streetIndex = afterCity.indexOf(streetMarker);

    if (wardIndex >= 0) {
      citySlug = afterCity.slice(0, wardIndex);
      const wardAndStreet = afterCity.slice(wardIndex + wardMarker.length);
      const streetInWard = wardAndStreet.indexOf(streetMarker);

      if (streetInWard >= 0) {
        wardSlug = wardAndStreet.slice(0, streetInWard);
        streetSlug = wardAndStreet.slice(streetInWard + streetMarker.length);
      } else {
        wardSlug = wardAndStreet;
      }
    } else if (streetIndex >= 0) {
      citySlug = afterCity.slice(0, streetIndex);
      streetSlug = afterCity.slice(streetIndex + streetMarker.length);
    } else {
      citySlug = afterCity;
    }
  }

  return {
    pending: removeMatchedSuffix(pending, locationMatch[0]),
    city: citySlugToName.get(citySlug) ?? "",
    ward: wardSlugToName.get(wardSlug) ?? "",
    street: streetSlugToName.get(streetSlug) ?? "",
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

// -----------------------------------------------------------------------------
// Build flat URL canonical từ state filter hiện tại.
// Thứ tự token trong URL đang dùng:
//   loai -> gia -> dien-tich -> khu-vuc -> phong-ngu -> phong-tam -> huong
// Parse ngược cũng dựa đúng thứ tự này (đi từ phải qua trái).
// -----------------------------------------------------------------------------
export function buildPropertyFilterPath(
  basePath: string,
  value: AdvancedFilterValue,
) {
  const tokens: string[] = [];

  const propertyTypeName = value.propertyTypes[0] ?? "";
  if (propertyTypeName) {
    const category = mockCategoryProperty.find(
      (item) => item.name === propertyTypeName,
    );
    if (category) {
      tokens.push(CATEGORY_SLUG_TO_TOKEN.get(category.slug) ?? category.slug);
    }
  }

  const priceToken = buildPriceToken(
    value.priceMin,
    value.priceMax,
    value.negotiable,
  );
  if (priceToken) tokens.push(priceToken);

  const areaToken = buildAreaToken(value.areaMin, value.areaMax);
  if (areaToken) tokens.push(areaToken);

  const locationToken = buildLocationToken(
    value.city,
    value.ward,
    value.street,
  );
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

export function parsePropertyFilterSlug(rawSlug: string | undefined) {
  const initial = { ...INITIAL_ADVANCED_FILTER_VALUE };

  if (!rawSlug) {
    return initial;
  }

  let pending = compact(rawSlug);

  // Parse từ phải sang trái vì token được append theo thứ tự cố định ở hàm build.
  // Cách này giúp tránh token phía trước "ăn" nhầm token phía sau.
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

  const locationParsed = parseLocationToken(pending);
  pending = locationParsed.pending;
  initial.city = locationParsed.city;
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
  const typeName = propertyTypeSlugToName.get(typeSlug);
  if (typeName) {
    initial.propertyTypes = [typeName];
  }

  return initial;
}

export function parseNewsCategoryFromSlug(slug?: string) {
  if (!slug) return "tin-tuc";
  const matched = mockCategoryNews.find((item) => item.slug === slug);
  return matched ? matched.slug : "tin-tuc";
}

export function parseProjectCategoryFromSlug(slug?: string) {
  if (!slug) return "du-an";
  const matched = mockCategoryProject.find((item) => item.slug === slug);
  return matched ? matched.slug : "du-an";
}

// Hàm hỗ trợ flat url slug cho dynamic breadcrumb
export function buildNewsCategoryBreadcrumbs(slug?: string) {
  const categorySlug = parseNewsCategoryFromSlug(slug);
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Tin tức", href: "/tin-tuc" },
  ];

  if (categorySlug !== "tin-tuc") {
    const category = mockCategoryNews.find(
      (item) => item.slug === categorySlug,
    );
    if (category) {
      items.push({ label: category.name });
    }
  }

  return items;
}

export function buildProjectCategoryBreadcrumbs(slug?: string) {
  const categorySlug = parseProjectCategoryFromSlug(slug);
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/du-an" },
  ];

  if (categorySlug !== "du-an") {
    const category = mockCategoryProject.find(
      (item) => item.slug === categorySlug,
    );
    if (category) {
      items.push({ label: category.name });
    }
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

// -----------------------------------------------------------------------------
// Build breadcrumb từ kết quả parse URL để đảm bảo:
// - Rule hiển thị breadcrumb luôn đồng bộ với rule encode/decode URL
// - Tránh tình trạng URL đúng nhưng breadcrumb lệch nghĩa
// -----------------------------------------------------------------------------
export function buildPropertyFilterBreadcrumbs(
  basePath: "/cho-thue" | "/can-thue",
  rawSlug?: string,
) {
  const rootLabel = basePath === "/cho-thue" ? "Cho thuê" : "Cần thuê";
  const items: BreadcrumbItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: rootLabel, href: basePath },
  ];

  if (!rawSlug) {
    return items;
  }

  const parsed = parsePropertyFilterSlug(rawSlug);

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

  const locationLabel = [parsed.city, parsed.ward, parsed.street]
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
