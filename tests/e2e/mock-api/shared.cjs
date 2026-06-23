function nowIso() {
  return new Date().toISOString();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setCorsHeaders(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "false");
}

function sendJson(res, statusCode, body, origin) {
  setCorsHeaders(res, origin);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function sendText(res, statusCode, body, origin) {
  setCorsHeaders(res, origin);
  res.writeHead(statusCode, { "Content-Type": "text/plain" });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });
  });
}

function getBearerToken(req) {
  const value = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(value);
  return match ? match[1] : "";
}

function createSharedHelpers(state) {
  function issueTokenPair(user) {
    const accessToken = `access-${user.id}-${user.role.toLowerCase()}`;
    const refreshToken = `refresh-${user.id}-${user.role.toLowerCase()}`;
    state.tokens.set(accessToken, user.id);
    state.refreshTokens.set(refreshToken, user.id);
    return { accessToken, refreshToken };
  }

  function getCurrentUserFromRequest(req) {
    const token = getBearerToken(req);
    const userId = state.tokens.get(token);
    if (!userId) return null;
    return state.users.find((user) => user.id === userId) || null;
  }

  function getUserByRefreshToken(refreshToken) {
    const userId = state.refreshTokens.get(refreshToken);
    if (!userId) return null;
    return state.users.find((user) => user.id === userId) || null;
  }

  function envelope(data, meta) {
    return meta ? { data, meta } : { data };
  }

  function listMeta(total, page = 1, limit = total || 1) {
    const currentPage = Math.max(1, Number(page) || 1);
    const nextLimit = Math.max(1, Number(limit) || 1);
    const totalPage = Math.max(1, Math.ceil(total / nextLimit));
    return {
      total,
      currentPage,
      limit: nextLimit,
      totalPage,
      hasNextPage: currentPage < totalPage,
      hasPreviousPage: currentPage > 1,
    };
  }

  function makeProperty(payload, owner) {
    const id = state.nextPropertyId++;
    const slug = payload.slug || `property-${id}`;
    const province = state.provinces.find(
      (item) => item.id === Number(payload.provinceId),
    );
    const ward = state.wards.find((item) => item.id === Number(payload.wardId));
    const category = state.categories.find(
      (item) => item.id === Number(payload.categoryId),
    );

    return {
      id,
      userId: owner?.id ?? null,
      title: payload.title,
      slug,
      categoryId: Number(payload.categoryId),
      category: category
        ? {
            id: category.id,
            type: category.type,
            name: category.name,
            slug: category.slug,
          }
        : null,
      price: payload.isNegotiable ? null : Number(payload.price ?? 0),
      priceAmount: payload.isNegotiable ? null : Number(payload.priceAmount ?? 0),
      priceUnit: payload.priceUnit || "MILLION",
      isNegotiable: Boolean(payload.isNegotiable),
      area: Number(payload.area ?? 0),
      direction: payload.direction || null,
      bedrooms: Number(payload.bedrooms ?? 0),
      bathrooms: Number(payload.bathrooms ?? 0),
      floors: Number(payload.floors ?? 0),
      priorityStatus: payload.priorityStatus || "FREE",
      publishSource: payload.publishSource || "FREE_QUOTA",
      isBoosted: Boolean(payload.isBoosted),
      boostCount: Number(payload.boostCount ?? 0),
      provinceId: Number(payload.provinceId ?? 0),
      province: province
        ? { id: province.id, name: province.name, slug: province.slug }
        : null,
      wardId: payload.wardId ? Number(payload.wardId) : null,
      ward: ward
        ? {
            id: ward.id,
            provinceId: ward.provinceId,
            name: ward.name,
            slug: ward.slug,
          }
        : null,
      addressDetail: payload.addressDetail || null,
      longitude: payload.longitude ?? null,
      latitude: payload.latitude ?? null,
      contactName: payload.contactName,
      contactPhone: payload.contactPhone,
      content: payload.content || null,
      viewCount: 0,
      status: payload.status || "PUBLISHED",
      isFeatured: Boolean(payload.isFeatured),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      images: Array.isArray(payload.images)
        ? payload.images.map((image, index) => ({
            id: id * 100 + index + 1,
            imageUrl: image.imageUrl || "/imgs/wallpaper-1.jpg",
            imagePublicId:
              image.imagePublicId || `properties/draft/${slug}/${index + 1}`,
            sortOrder: index + 1,
          }))
        : [],
    };
  }

  function makeRentRequest(payload, owner) {
    const id = state.nextRentRequestId++;
    const slug = payload.slug || `rent-request-${id}`;
    const category = state.categories.find(
      (item) => item.id === Number(payload.categoryId),
    );
    const province = state.provinces.find(
      (item) => item.id === Number(payload.desiredProvinceId),
    );
    const ward = state.wards.find(
      (item) => item.id === Number(payload.desiredWardId),
    );

    return {
      id,
      userId: owner?.id ?? null,
      title: payload.title,
      slug,
      categoryId: Number(payload.categoryId),
      category: category
        ? {
            id: category.id,
            type: category.type,
            name: category.name,
            slug: category.slug,
          }
        : null,
      desiredProvinceId: Number(payload.desiredProvinceId),
      desiredProvince: province
        ? { id: province.id, name: province.name, slug: province.slug }
        : null,
      desiredWardId: payload.desiredWardId ? Number(payload.desiredWardId) : null,
      desiredWard: ward
        ? {
            id: ward.id,
            provinceId: ward.provinceId,
            name: ward.name,
            slug: ward.slug,
          }
        : null,
      budget: Number(payload.budget ?? payload.budgetAmount ?? 0),
      budgetAmount: Number(payload.budgetAmount ?? 0),
      budgetUnit: payload.budgetUnit || "MILLION",
      desiredArea: Number(payload.desiredArea ?? 0),
      bedrooms: Number(payload.bedrooms ?? 0),
      bathrooms: Number(payload.bathrooms ?? 0),
      floors: Number(payload.floors ?? 0),
      desiredDirection: payload.desiredDirection || null,
      requirementText: payload.requirementText || null,
      contactName: payload.contactName,
      contactPhone: payload.contactPhone,
      status: payload.status || "PUBLISHED",
      isMatched: Boolean(payload.isMatched),
      viewCount: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  }

  function findPropertyBySlug(slug) {
    return state.properties.find((item) => item.slug === slug) || null;
  }

  function findRentRequestBySlug(slug) {
    return state.rentRequests.find((item) => item.slug === slug) || null;
  }

  function filterByText(items, textFields, q) {
    const keyword = String(q || "")
      .trim()
      .toLowerCase();
    if (!keyword) return items;
    return items.filter((item) =>
      textFields.some((field) =>
        String(item[field] || "")
          .toLowerCase()
          .includes(keyword),
      ),
    );
  }

  function suggestByKeyword(keyword, contextResource) {
    const normalized = String(keyword || "")
      .toLowerCase()
      .trim();
    const propertySuggestion = {
      kind: "category_location",
      label: "Căn hộ Hồ Chí Minh",
      targetResource: "property",
      flatSlug: "can-ho-tp-ho-chi-minh",
      routeParts: {
        categorySlug: "can-ho",
        provinceSlug: "tp-ho-chi-minh",
      },
      display: {
        categoryName: "Căn hộ",
        provinceName: "Hồ Chí Minh",
      },
    };

    const rentSuggestion = {
      kind: "category_location",
      label: "Căn hộ Hồ Chí Minh",
      targetResource: "rent-request",
      flatSlug: "can-ho-tp-ho-chi-minh",
      routeParts: {
        categorySlug: "can-ho",
        provinceSlug: "tp-ho-chi-minh",
      },
      display: {
        categoryName: "Căn hộ",
        provinceName: "Hồ Chí Minh",
      },
    };

    const officeSuggestion = {
      kind: "category_location",
      label: "Văn phòng Quận 1",
      targetResource:
        contextResource === "rent-request" ? "rent-request" : "property",
      flatSlug: "van-phong-tp-ho-chi-minh-phuong-ben-nghe",
      routeParts: {
        categorySlug: "van-phong",
        provinceSlug: "tp-ho-chi-minh",
        wardSlug: "phuong-ben-nghe",
      },
      display: {
        categoryName: "Văn phòng",
        provinceName: "Hồ Chí Minh",
        wardName: "Quận 1",
      },
    };

    if (!normalized) {
      return [propertySuggestion];
    }
    if (normalized.includes("van phong")) return [officeSuggestion];
    if (normalized.includes("can ho")) {
      return [
        contextResource === "rent-request" ? rentSuggestion : propertySuggestion,
      ];
    }
    if (normalized.includes("ho chi minh")) return [propertySuggestion];
    return [propertySuggestion];
  }

  function pathMatches(pathname, target) {
    return pathname === target || pathname.startsWith(`${target}/`);
  }

  function readQueryNumber(url, name, fallback) {
    const value = Number(url.searchParams.get(name));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function buildPageResponse(items, url) {
    const page = readQueryNumber(url, "page", 1);
    const limit = readQueryNumber(url, "limit", items.length || 1);
    const start = (page - 1) * limit;
    return {
      data: items.slice(start, start + limit),
      meta: listMeta(items.length, page, limit),
    };
  }

  return {
    issueTokenPair,
    getCurrentUserFromRequest,
    getUserByRefreshToken,
    envelope,
    listMeta,
    makeProperty,
    makeRentRequest,
    findPropertyBySlug,
    findRentRequestBySlug,
    filterByText,
    suggestByKeyword,
    pathMatches,
    readQueryNumber,
    buildPageResponse,
  };
}

module.exports = {
  nowIso,
  clone,
  setCorsHeaders,
  sendJson,
  sendText,
  parseBody,
  getBearerToken,
  createSharedHelpers,
};
