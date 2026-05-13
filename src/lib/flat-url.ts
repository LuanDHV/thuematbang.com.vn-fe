import {
  mockCategoryNews,
  mockCategoryProject,
  mockCategoryProperty,
} from "@/mocks/categories";
import {
  FILTER_LIMITS,
  mockFilterAreaOptions,
  mockFilterPriceOptions,
} from "@/mocks/filter";
import {
  AdvancedFilterValue,
  INITIAL_ADVANCED_FILTER_VALUE,
} from "@/types/filter";

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

const propertyTypeSlugToName = new Map(
  mockCategoryProperty.map((category) => [category.slug, category.name]),
);

const areaTokenMatchers = mockFilterAreaOptions
  .filter((option) => option.min || option.max)
  .map((option) => ({
    token: buildAreaToken(option.min, option.max),
    min: option.min,
    max: option.max,
  }))
  .filter((item) => item.token)
  .sort((left, right) => right.token.length - left.token.length);

const priceTokenMatchers = mockFilterPriceOptions
  .filter((option) => option.min || option.max || option.isNegotiable)
  .map((option) => ({
    token: buildPriceToken(
      option.min,
      option.max,
      Boolean(option.isNegotiable),
    ),
    min: option.min,
    max: option.max,
    negotiable: Boolean(option.isNegotiable),
  }))
  .filter((item) => item.token)
  .sort((left, right) => right.token.length - left.token.length);

function matchSuffixToken<T extends { token: string }>(
  value: string,
  candidates: T[],
) {
  return candidates.find((candidate) => value.endsWith(candidate.token));
}

export function buildPropertyFilterPath(
  basePath: string,
  value: AdvancedFilterValue,
) {
  const tokens: string[] = [];

  const propertyTypeName = value.propertyTypes[0];
  if (propertyTypeName) {
    tokens.push(compact(propertyTypeName));
  }

  const priceToken = buildPriceToken(
    value.priceMin,
    value.priceMax,
    value.negotiable,
  );
  if (priceToken) tokens.push(priceToken);

  const areaToken = buildAreaToken(value.areaMin, value.areaMax);
  if (areaToken) tokens.push(areaToken);

  if (tokens.length === 0) return basePath;
  return `${basePath}/${tokens.join("-")}`;
}

export function parsePropertyFilterSlug(rawSlug: string | undefined) {
  const initial = { ...INITIAL_ADVANCED_FILTER_VALUE };

  if (!rawSlug) {
    return initial;
  }

  let pending = compact(rawSlug);

  const areaMatch = matchSuffixToken(pending, areaTokenMatchers);
  if (areaMatch) {
    initial.areaMin = areaMatch.min;
    initial.areaMax = areaMatch.max;
    pending = pending.slice(0, -(areaMatch.token.length + 1));
  }

  const priceMatch = matchSuffixToken(pending, priceTokenMatchers);
  if (priceMatch) {
    initial.priceMin = priceMatch.min;
    initial.priceMax = priceMatch.max || String(FILTER_LIMITS.PRICE_MAX);
    initial.negotiable = priceMatch.negotiable;
    pending = pending.slice(0, -(priceMatch.token.length + 1));
  }

  const typeName = propertyTypeSlugToName.get(pending);
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
