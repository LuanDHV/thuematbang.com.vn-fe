const http = require("node:http");
const { URL } = require("node:url");

const port = Number(process.env.PLAYWRIGHT_MOCK_API_PORT || 4010);
const baseUrl = `http://127.0.0.1:${port}`;
const apiBaseUrl = `${baseUrl}/api/v1`;

const seedProvinces = [
  { id: 1, name: "Hồ Chí Minh", slug: "tp-ho-chi-minh" },
  { id: 2, name: "Hà Nội", slug: "tp-ha-noi" },
];

const seedWards = [
  { id: 11, provinceId: 1, name: "Quận 1", slug: "phuong-ben-nghe" },
  { id: 12, provinceId: 1, name: "Quận 7", slug: "phuong-tan-phong" },
  { id: 21, provinceId: 2, name: "Ba Đình", slug: "phuong-ba-dinh" },
];

const state = {
  nextUserId: 3,
  nextPropertyId: 3,
  nextRentRequestId: 3,
  users: [
    {
      id: 1,
      fullName: "Test Customer",
      email: "customer@example.com",
      phone: "0901000001",
      role: "CUSTOMER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      fullName: "Test Admin",
      email: "admin@example.com",
      phone: "0901000002",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  tokens: new Map(),
  refreshTokens: new Map(),
  categories: [
    { id: 11, type: "PROPERTY", name: "Văn phòng", slug: "van-phong" },
    { id: 12, type: "PROPERTY", name: "Mặt bằng", slug: "mat-bang" },
    {
      id: 21,
      type: "RENT_REQUEST",
      name: "Căn hộ chung cư",
      slug: "can-ho-chung-cu",
    },
    {
      id: 22,
      type: "RENT_REQUEST",
      name: "Văn phòng",
      slug: "van-phong",
    },
    {
      id: 31,
      type: "NEWS",
      name: "Tin tức",
      slug: "tin-tuc",
    },
  ],
  provinces: seedProvinces,
  wards: seedWards,
  seoContents: {
    "cho-thue": {
      page: "cho-thue",
      title: "Cho thuê mặt bằng",
      description: "Nội dung SEO cho trang cho thuê.",
    },
    "can-thue": {
      page: "can-thue",
      title: "Cần thuê bất động sản",
      description: "Nội dung SEO cho trang cần thuê.",
    },
  },
  faqs: {
    "cho-thue": [
      { id: 1, question: "Cần chuẩn bị gì?", answer: "Chuẩn bị form." },
    ],
    "can-thue": [
      { id: 2, question: "Có đăng nhu cầu thuê không?", answer: "Có." },
    ],
  },
  properties: [
    {
      id: 1,
      userId: 1,
      title: "Mặt bằng Quận 1",
      slug: "mat-bang-quan-1",
      categoryId: 12,
      category: {
        id: 12,
        type: "PROPERTY",
        name: "Mặt bằng",
        slug: "mat-bang",
      },
      price: 25000000,
      priceAmount: 25,
      priceUnit: "MILLION",
      isNegotiable: false,
      area: 120,
      direction: "EAST",
      bedrooms: 0,
      bathrooms: 1,
      floors: 1,
      priorityStatus: "FREE",
      publishSource: "FREE_QUOTA",
      isBoosted: false,
      boostCount: 0,
      provinceId: 1,
      province: seedProvinces[0],
      wardId: 11,
      ward: seedWards[0],
      addressDetail: "123 Lê Lợi",
      longitude: 106.7,
      latitude: 10.8,
      contactName: "Test Customer",
      contactPhone: "0901000001",
      content: "Nội dung demo",
      viewCount: 10,
      status: "PUBLISHED",
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        {
          id: 1,
          imageUrl: "/imgs/wallpaper-1.jpg",
          imagePublicId: "properties/demo/1",
          sortOrder: 1,
        },
      ],
    },
    {
      id: 2,
      userId: 1,
      title: "Văn phòng Quận 7",
      slug: "van-phong-quan-7",
      categoryId: 11,
      category: {
        id: 11,
        type: "PROPERTY",
        name: "Văn phòng",
        slug: "van-phong",
      },
      price: 40000000,
      priceAmount: 40,
      priceUnit: "MILLION",
      isNegotiable: false,
      area: 180,
      direction: "SOUTH",
      bedrooms: 0,
      bathrooms: 2,
      floors: 2,
      priorityStatus: "STANDARD",
      publishSource: "FREE_QUOTA",
      isBoosted: false,
      boostCount: 0,
      provinceId: 1,
      province: seedProvinces[0],
      wardId: 12,
      ward: seedWards[1],
      addressDetail: "456 Nguyễn Văn Linh",
      longitude: 106.72,
      latitude: 10.74,
      contactName: "Test Customer",
      contactPhone: "0901000001",
      content: "Nội dung demo 2",
      viewCount: 4,
      status: "PUBLISHED",
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [
        {
          id: 2,
          imageUrl: "/imgs/wallpaper-2.jpg",
          imagePublicId: "properties/demo/2",
          sortOrder: 1,
        },
      ],
    },
  ],
  rentRequests: [
    {
      id: 1,
      userId: 1,
      title: "Cần thuê căn hộ Quận 1",
      slug: "can-thue-can-ho-quan-1",
      categoryId: 21,
      category: {
        id: 21,
        type: "RENT_REQUEST",
        name: "Căn hộ chung cư",
        slug: "can-ho-chung-cu",
      },
      desiredProvinceId: 1,
      desiredProvince: seedProvinces[0],
      desiredWardId: 11,
      desiredWard: seedWards[0],
      budget: 15000000,
      budgetAmount: 15,
      budgetUnit: "MILLION",
      desiredArea: 75,
      bedrooms: 2,
      bathrooms: 1,
      floors: 0,
      desiredDirection: "EAST",
      requirementText: "Ưu tiên gần trung tâm.",
      contactName: "Test Customer",
      contactPhone: "0901000001",
      status: "PUBLISHED",
      isMatched: false,
      viewCount: 9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      userId: 1,
      title: "Cần thuê văn phòng Quận 7",
      slug: "can-thue-van-phong-quan-7",
      categoryId: 22,
      category: {
        id: 22,
        type: "RENT_REQUEST",
        name: "Văn phòng",
        slug: "van-phong",
      },
      desiredProvinceId: 1,
      desiredProvince: seedProvinces[0],
      desiredWardId: 12,
      desiredWard: seedWards[1],
      budget: 30000000,
      budgetAmount: 30,
      budgetUnit: "MILLION",
      desiredArea: 140,
      bedrooms: 0,
      bathrooms: 1,
      floors: 1,
      desiredDirection: "SOUTH",
      requirementText: "Cần chỗ để xe.",
      contactName: "Test Customer",
      contactPhone: "0901000001",
      status: "PUBLISHED",
      isMatched: false,
      viewCount: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  news: [
    {
      id: 1,
      title: "Tin tức mẫu",
      slug: "tin-tuc-mau",
      categoryId: 31,
      category: { id: 31, type: "NEWS", name: "Tin tức", slug: "tin-tuc" },
      createdAt: new Date().toISOString(),
    },
  ],
  banners: [
    {
      id: 1,
      imageUrl: "/imgs/wallpaper-3.jpg",
      imagePublicId: "banners/1",
      isActive: true,
    },
  ],
  leads: [
    {
      id: 1,
      fullName: "Lead mẫu",
      phone: "0901000099",
      message: "Xin chào",
      createdAt: new Date().toISOString(),
    },
  ],
};

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

async function handleRequest(req, res) {
  const requestUrl = new URL(req.url, baseUrl);
  const origin = req.headers.origin || "*";

  if (req.method === "OPTIONS") {
    setCorsHeaders(res, origin);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/health") {
    sendJson(res, 200, { data: { ok: true } }, origin);
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/cloudinary/upload") {
    await parseBody(req);
    sendJson(
      res,
      200,
      {
        secure_url: "/imgs/wallpaper-1.jpg",
        public_id: `properties/draft/${Date.now()}`,
        width: 1600,
        height: 900,
        bytes: 1024,
      },
      origin,
    );
    return;
  }

  if (requestUrl.pathname === "/api/v1/auth/login" && req.method === "POST") {
    const body = await parseBody(req);
    const identifier = String(body.identifier || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "").trim();
    const isCustomerLogin =
      identifier === "customer@example.com" &&
      password.includes("Password123!");
    const isAdminLogin =
      identifier === "admin@example.com" && password.includes("Admin123!");
    const user =
      state.users.find(
        (item) =>
          (item.email.toLowerCase() === identifier ||
            item.phone === identifier) &&
          (isCustomerLogin || isAdminLogin),
      ) ||
      (isAdminLogin
        ? state.users.find((item) => item.role === "ADMIN")
        : null) ||
      (isCustomerLogin
        ? state.users.find((item) => item.role === "CUSTOMER")
        : null);

    if (!user) {
      sendJson(res, 401, { message: "Invalid credentials" }, origin);
      return;
    }

    const tokens = issueTokenPair(user);
    sendJson(
      res,
      200,
      {
        ...tokens,
        message: "Đăng nhập thành công",
        user,
      },
      origin,
    );
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/auth/register" &&
    req.method === "POST"
  ) {
    const body = await parseBody(req);
    const user = {
      id: state.nextUserId++,
      fullName: body.fullName || "Người dùng mới",
      email: body.email || `user-${Date.now()}@example.com`,
      phone: body.phone || "0901999999",
      role: "CUSTOMER",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    state.users.push(user);
    const tokens = issueTokenPair(user);
    sendJson(
      res,
      200,
      {
        ...tokens,
        message: "Đăng ký thành công",
        user,
      },
      origin,
    );
    return;
  }

  if (requestUrl.pathname === "/api/v1/auth/logout" && req.method === "POST") {
    sendJson(res, 200, { ok: true, message: "Đăng xuất thành công" }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/auth/refresh" && req.method === "POST") {
    const body = await parseBody(req);
    const user = getUserByRefreshToken(String(body.refreshToken || ""));
    if (!user) {
      sendJson(res, 401, { message: "Invalid refresh token" }, origin);
      return;
    }
    sendJson(res, 200, { ...issueTokenPair(user), user }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/users/me" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    sendJson(res, 200, envelope(user), origin);
    return;
  }

  if (
    pathMatches(requestUrl.pathname, "/api/v1/admin/users") &&
    req.method === "GET"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    const search = String(requestUrl.searchParams.get("q") || "").toLowerCase();
    const items = state.users.filter(
      (item) =>
        !search ||
        item.fullName.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        String(item.phone || "").includes(search),
    );
    if (/\/api\/v1\/admin\/users\/\d+$/.test(requestUrl.pathname)) {
      const id = Number(requestUrl.pathname.split("/").pop());
      const found = items.find((item) => item.id === id);
      if (!found) {
        sendJson(res, 404, { message: "User not found" }, origin);
        return;
      }
      sendJson(res, 200, envelope(found), origin);
      return;
    }
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/admin\/users\/\d+\/role$/) &&
    req.method === "PATCH"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    const id = Number(requestUrl.pathname.split("/")[4]);
    const found = state.users.find((item) => item.id === id);
    if (!found) {
      sendJson(res, 404, { message: "User not found" }, origin);
      return;
    }
    const body = await parseBody(req);
    found.role = body.role || found.role;
    found.updatedAt = nowIso();
    sendJson(res, 200, envelope(found), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/categories" && req.method === "GET") {
    const type = String(requestUrl.searchParams.get("type") || "");
    const items = type
      ? state.categories.filter((item) => item.type === type)
      : state.categories;
    sendJson(res, 200, envelope(clone(items)), origin);
    return;
  }

  if (
    pathMatches(requestUrl.pathname, "/api/v1/categories/") &&
    req.method === "GET"
  ) {
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.categories.find((category) => category.id === id);
    if (!item) {
      sendJson(res, 404, { message: "Category not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/locations/provinces" &&
    req.method === "GET"
  ) {
    sendJson(res, 200, envelope(clone(state.provinces)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(
      /^\/api\/v1\/locations\/provinces\/\d+\/wards$/,
    ) &&
    req.method === "GET"
  ) {
    const provinceId = Number(requestUrl.pathname.split("/")[5]);
    const items = state.wards.filter((ward) => ward.provinceId === provinceId);
    sendJson(res, 200, envelope(clone(items)), origin);
    return;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/seo-contents/page/") &&
    req.method === "GET"
  ) {
    const pageKey = decodeURIComponent(
      requestUrl.pathname.split("/").pop() || "",
    );
    const item = state.seoContents[pageKey] || null;
    if (!item) {
      sendJson(res, 404, { message: "SEO content not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/faqs/page/") &&
    req.method === "GET"
  ) {
    const pageKey = decodeURIComponent(
      requestUrl.pathname.split("/").pop() || "",
    );
    const items = state.faqs[pageKey] || [];
    sendJson(res, 200, envelope({ page: pageKey, faqs: clone(items) }), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/faqs" && req.method === "GET") {
    const items = Object.values(state.faqs).flat();
    sendJson(res, 200, envelope(clone(items)), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/public-search/suggestions" &&
    req.method === "GET"
  ) {
    const keyword = requestUrl.searchParams.get("keyword") || "";
    const contextResource =
      requestUrl.searchParams.get("contextResource") || "property";
    const items = suggestByKeyword(keyword, contextResource);
    sendJson(res, 200, envelope(items), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/media/signature" &&
    req.method === "POST"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const body = await parseBody(req);
    const resourceType = String(body.resourceType || "properties");
    const draftId = String(body.draftId || "draft");
    const timestamp = Math.floor(Date.now() / 1000);
    sendJson(
      res,
      200,
      envelope({
        cloudName: "mock-cloud",
        apiKey: "mock-api-key",
        folder: `${resourceType}/drafts/${draftId}`,
        timestamp,
        signature: `mock-signature-${timestamp}`,
        uploadUrl: `${baseUrl}/cloudinary/upload`,
      }),
      origin,
    );
    return;
  }

  if (requestUrl.pathname === "/api/v1/media" && req.method === "DELETE") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    sendJson(res, 200, envelope({ ok: true, message: "Deleted" }), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/properties" && req.method === "GET") {
    const items = filterByText(
      state.properties,
      ["title", "slug"],
      requestUrl.searchParams.get("q"),
    );
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/properties/search/by-slug/") &&
    req.method === "GET"
  ) {
    const flatSlug = decodeURIComponent(
      requestUrl.pathname.split("/").pop() || "",
    );
    const items = state.properties.filter((item) => {
      if (flatSlug.includes("van-phong")) {
        return item.category?.slug === "van-phong";
      }
      if (flatSlug.includes("can-ho")) {
        return (
          item.category?.slug === "mat-bang" ||
          item.category?.slug === "can-ho-chung-cu"
        );
      }
      return true;
    });
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    pathMatches(requestUrl.pathname, "/api/v1/properties/slug/") &&
    req.method === "GET"
  ) {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const item = findPropertyBySlug(slug);
    if (!item) {
      sendJson(res, 404, { message: "Property not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/properties\/\d+$/) &&
    req.method === "GET"
  ) {
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.properties.find((property) => property.id === id);
    if (!item) {
      sendJson(res, 404, { message: "Property not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/properties" && req.method === "POST") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const body = await parseBody(req);
    const item = makeProperty(body, user);
    state.properties.unshift(item);
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/properties\/\d+$/) &&
    req.method === "PATCH"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.properties.find((property) => property.id === id);
    if (!item) {
      sendJson(res, 404, { message: "Property not found" }, origin);
      return;
    }
    const body = await parseBody(req);
    Object.assign(item, body, { updatedAt: nowIso() });
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/properties\/\d+$/) &&
    req.method === "DELETE"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const id = Number(requestUrl.pathname.split("/").pop());
    const index = state.properties.findIndex((property) => property.id === id);
    if (index < 0) {
      sendJson(res, 404, { message: "Property not found" }, origin);
      return;
    }
    const [removed] = state.properties.splice(index, 1);
    sendJson(res, 200, envelope(clone(removed)), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/me/properties" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const items = state.properties.filter((item) => item.userId === user.id);
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/rent-requests" && req.method === "GET") {
    const items = filterByText(
      state.rentRequests,
      ["title", "slug"],
      requestUrl.searchParams.get("q"),
    );
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/rent-requests/search/by-slug/") &&
    req.method === "GET"
  ) {
    const flatSlug = decodeURIComponent(
      requestUrl.pathname.split("/").pop() || "",
    );
    const items = state.rentRequests.filter((item) => {
      if (flatSlug.includes("van-phong")) {
        return item.category?.slug === "van-phong";
      }
      if (flatSlug.includes("can-ho")) {
        return item.category?.slug === "can-ho-chung-cu";
      }
      return true;
    });
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/rent-requests/category/") &&
    req.method === "GET"
  ) {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const items = state.rentRequests.filter(
      (item) => item.category?.slug === slug,
    );
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (
    pathMatches(requestUrl.pathname, "/api/v1/rent-requests/slug/") &&
    req.method === "GET"
  ) {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const item = findRentRequestBySlug(slug);
    if (!item) {
      sendJson(res, 404, { message: "Rent request not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/rent-requests\/\d+$/) &&
    req.method === "GET"
  ) {
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.rentRequests.find(
      (rentRequest) => rentRequest.id === id,
    );
    if (!item) {
      sendJson(res, 404, { message: "Rent request not found" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/rent-requests" &&
    req.method === "POST"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const body = await parseBody(req);
    const item = makeRentRequest(body, user);
    state.rentRequests.unshift(item);
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/rent-requests\/\d+$/) &&
    req.method === "PATCH"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.rentRequests.find(
      (rentRequest) => rentRequest.id === id,
    );
    if (!item) {
      sendJson(res, 404, { message: "Rent request not found" }, origin);
      return;
    }
    const body = await parseBody(req);
    Object.assign(item, body, { updatedAt: nowIso() });
    sendJson(res, 200, envelope(clone(item)), origin);
    return;
  }

  if (
    requestUrl.pathname.match(/^\/api\/v1\/rent-requests\/\d+$/) &&
    req.method === "DELETE"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const id = Number(requestUrl.pathname.split("/").pop());
    const index = state.rentRequests.findIndex(
      (rentRequest) => rentRequest.id === id,
    );
    if (index < 0) {
      sendJson(res, 404, { message: "Rent request not found" }, origin);
      return;
    }
    const [removed] = state.rentRequests.splice(index, 1);
    sendJson(res, 200, envelope(clone(removed)), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/me/rent-requests" &&
    req.method === "GET"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(res, 401, { message: "Unauthorized" }, origin);
      return;
    }
    const items = state.rentRequests.filter((item) => item.userId === user.id);
    sendJson(res, 200, buildPageResponse(items, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/news" && req.method === "GET") {
    sendJson(res, 200, buildPageResponse(state.news, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/banners" && req.method === "GET") {
    sendJson(res, 200, buildPageResponse(state.banners, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/leads" && req.method === "GET") {
    sendJson(res, 200, buildPageResponse(state.leads, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/admin/users" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    sendJson(res, 200, buildPageResponse(state.users, requestUrl), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/admin/users/1" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(state.users[0])), origin);
    return;
  }

  if (requestUrl.pathname === "/api/v1/admin/users/2" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(state.users[1])), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/admin/users/1/role" &&
    req.method === "PATCH"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(state.users[0])), origin);
    return;
  }

  if (
    requestUrl.pathname === "/api/v1/admin/users/2/role" &&
    req.method === "PATCH"
  ) {
    const user = getCurrentUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      sendJson(res, 401, { message: "Admin role is required" }, origin);
      return;
    }
    sendJson(res, 200, envelope(clone(state.users[1])), origin);
    return;
  }

  sendText(res, 404, "Not found", origin);
}

const server = http.createServer((req, res) => {
  void handleRequest(req, res);
});

function listen() {
  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      // Keep console output compact; the launcher logs the port once.
      resolve();
    });
  });
}

function close() {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

module.exports = {
  apiBaseUrl,
  baseUrl,
  port,
  server,
  listen,
  close,
};

if (require.main === module) {
  listen().then(() => {
    console.log(`Mock API server listening on ${apiBaseUrl}`);
  });
}
