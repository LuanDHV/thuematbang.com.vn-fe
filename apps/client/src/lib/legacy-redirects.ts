type LegacyRedirectResult = {
  target: string;
};

const EXACT_REDIRECTS = new Map<string, string>([
  ["/dang-ki.html", "/dang-ky"],
  ["/dang-nhap.html", "/dang-nhap"],
  ["/dang-tin.html", "/dang-tin/cho-thue"],
  ["/ky-gui.html", "/dang-tin/can-thue"],
  ["/gioi-thieu.html", "/gioi-thieu"],
  ["/lien-he.html", "/lien-he"],
  ["/cau-hoi-thuong-gap.html", "/cau-hoi-thuong-gap"],
  ["/tin-tuc.html", "/tin-tuc"],
  ["/du-an.html", "/du-an"],
  ["/bat-dong-san-noi-bat.html", "/cho-thue"],
  ["/can-thue.html", "/can-thue"],
  ["/cho-thue.html", "/cho-thue"],
  ["/quy-dinh/quy-che-hoat-dong.html", "/quy-che-hoat-dong"],
  [
    "/quy-dinh/chinh-sach-bao-mat-thong-tin.html",
    "/chinh-sach-bao-mat-thong-tin",
  ],
  [
    "/quy-dinh/co-che-giai-quyet-tranh-chap-khieu-nai.html",
    "/giai-quyet-tranh-chap-khieu-nai",
  ],
  ["/quy-dinh/dieu-khoan-thoa-thuan.html", "/dieu-khoan-thoa-thuan"],
  ["/quy-dinh/quy-dinh-dang-tin.html", "/quy-dinh-dang-tin"],
]);

const NEWS_CATEGORY_REDIRECTS: Record<string, string> = {
  "phong-thuy": "/tin-tuc/phong-thuy",
  "kien-truc": "/tin-tuc/kien-truc-xay-dung",
  "tu-van-luat": "/tin-tuc/tu-van-luat",
};

const CITY_REDIRECTS: Record<string, string> = {
  "ho-chi-minh": "/cho-thue/tp-ho-chi-minh",
  "ha-noi": "/cho-thue/tp-ha-noi",
  "da-nang": "/cho-thue/tp-da-nang",
  "binh-duong": "/cho-thue/tp-ho-chi-minh-phuong-binh-duong",
};

const NEWS_DETAIL_ROUTE_PREFIX = "/tin-tuc";

const LEGACY_NEWS_CATEGORY_PATHS = new Set(
  Object.keys(NEWS_CATEGORY_REDIRECTS),
);

function normalizeLegacyPath(pathname: string) {
  const trimmed = pathname.trim();
  if (!trimmed) {
    return "/";
  }

  return trimmed.replace(/\/+$/, "") || "/";
}

function buildPagedTarget(baseTarget: string, page: number) {
  if (page <= 1) {
    return baseTarget;
  }

  return `${baseTarget.replace(/\/+$/, "")}/p${page}`;
}

function resolveLegacyNewsCategoryTarget(pathname: string) {
  const normalized = normalizeLegacyPath(pathname);
  const categoryMatch = normalized.match(
    /^\/(phong-thuy|kien-truc|tu-van-luat)(?:\.html)?$/i,
  );

  if (!categoryMatch) {
    return null;
  }

  const key = categoryMatch[1].toLowerCase();
  return NEWS_CATEGORY_REDIRECTS[key] ?? "/tin-tuc";
}

// News detail routes are slug-only in the new app, so legacy detail URLs should
// drop the old category segment and land on the canonical article slug.
function resolveLegacyNewsDetailTarget(slug: string) {
  const normalizedSlug = slug.replace(/\.html$/i, "");
  return `${NEWS_DETAIL_ROUTE_PREFIX}/${normalizedSlug}`;
}

function classifyTinDangSlug(slug: string) {
  const normalized = slug.toLowerCase();

  const canThueKeywords = [
    "can-thue",
    "nhu-cau",
    "tim-thue",
    "tim-nha",
    "tim-van-phong",
    "can-",
  ];

  const matchedCanThue = canThueKeywords.some((keyword) =>
    normalized.includes(keyword),
  );

  return matchedCanThue ? `/can-thue/${slug}` : `/cho-thue/${slug}`;
}

function resolveLegacyNewsRedirect(pathname: string): string | null {
  const normalized = normalizeLegacyPath(pathname);

  const pagedMatch = normalized.match(/^(.*?)(?:\.html)?&p=(\d+)$/i);
  if (pagedMatch) {
    const basePath = normalizeLegacyPath(pagedMatch[1]);
    const page = Number(pagedMatch[2]);

    if (!Number.isFinite(page) || page < 1) {
      return resolveLegacyNewsRedirect(basePath);
    }

    const currentRootMatch = basePath.match(
      /^\/(tin-tuc|cho-thue|can-thue|du-an)(?:\.html)?$/i,
    );
    if (currentRootMatch) {
      return buildPagedTarget(`/${currentRootMatch[1]}`, page);
    }

    const legacyCategoryTarget = resolveLegacyNewsCategoryTarget(basePath);
    if (legacyCategoryTarget) {
      return buildPagedTarget(legacyCategoryTarget, page);
    }
  }

  const exactRedirect = EXACT_REDIRECTS.get(normalized);
  if (exactRedirect) {
    return exactRedirect;
  }

  const legacyCategoryTarget = resolveLegacyNewsCategoryTarget(normalized);
  if (legacyCategoryTarget) {
    return legacyCategoryTarget;
  }

  const legacyCategoryDetailMatch = normalized.match(
    /^\/(phong-thuy|kien-truc|tu-van-luat)\/(.+?)\.html$/i,
  );
  if (legacyCategoryDetailMatch) {
    return resolveLegacyNewsDetailTarget(legacyCategoryDetailMatch[2]);
  }

  const legacyCategoryLooseDetailMatch = normalized.match(
    /^\/(phong-thuy|kien-truc|tu-van-luat)\/(.+)$/i,
  );
  if (legacyCategoryLooseDetailMatch) {
    return resolveLegacyNewsDetailTarget(legacyCategoryLooseDetailMatch[2]);
  }

  const oldListingDetailMatch = normalized.match(/^\/tin-dang\/(.+?)\.html$/i);
  if (oldListingDetailMatch) {
    return classifyTinDangSlug(oldListingDetailMatch[1]);
  }

  if (/^\/tin-dang(?:\.html)?$/i.test(normalized)) {
    return "/cho-thue";
  }

  const currentDetailMatch = normalized.match(
    /^\/(cho-thue|can-thue|du-an|tin-tuc)\/(.+?)\.html$/i,
  );
  if (currentDetailMatch) {
    return `/${currentDetailMatch[1]}/${currentDetailMatch[2]}`;
  }

  return null;
}

export function resolveLegacyRedirect(
  pathname: string,
): LegacyRedirectResult | null {
  const normalized = normalizeLegacyPath(pathname);

  if (LEGACY_NEWS_CATEGORY_PATHS.has(normalized.replace(/\.html$/i, ""))) {
    const exactCategoryTarget = resolveLegacyNewsCategoryTarget(normalized);
    if (exactCategoryTarget) {
      return { target: exactCategoryTarget };
    }
  }

  const exactRedirect = EXACT_REDIRECTS.get(normalized);
  if (exactRedirect) {
    return { target: exactRedirect };
  }

  const newsRedirect = resolveLegacyNewsRedirect(normalized);
  if (newsRedirect) {
    return { target: newsRedirect };
  }

  const cityMatch = normalized.match(/^\/city\/([^/]+?)(?:\.html)?$/i);
  if (cityMatch) {
    const citySlug = cityMatch[1].toLowerCase();
    const cityTarget = CITY_REDIRECTS[citySlug];
    if (cityTarget) {
      return { target: cityTarget };
    }
  }

  return null;
}
