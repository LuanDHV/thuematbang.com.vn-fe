module.exports = async function handleListingsRoutes(context) {
  const {
    req,
    requestUrl,
    origin,
    state,
    sendJson,
    envelope,
    getCurrentUserFromRequest,
    makeProperty,
    makeRentRequest,
    clone,
  } = context;

  function sendList(items) {
    const page = Math.max(1, Number(requestUrl.searchParams.get("page") || 1));
    const limit = Math.max(1, Number(requestUrl.searchParams.get("limit") || items.length || 1));
    const start = (page - 1) * limit;
    const pagedItems = items.slice(start, start + limit);
    sendJson(context.res, 200, {
      data: clone(pagedItems),
      meta: {
        total: items.length,
        currentPage: page,
        limit,
        totalPage: Math.max(1, Math.ceil(items.length / limit)),
        hasNextPage: page < Math.max(1, Math.ceil(items.length / limit)),
        hasPreviousPage: page > 1,
      },
    }, origin);
  }

  function normalizeText(value) {
    return String(value || "").trim().toLowerCase();
  }

  function matchesRentRequestFilters(item) {
    const status = normalizeText(requestUrl.searchParams.get("status"));
    const categorySlug = normalizeText(requestUrl.searchParams.get("categorySlug"));
    const provinceSlug = normalizeText(requestUrl.searchParams.get("provinceSlug"));
    const wardSlug = normalizeText(requestUrl.searchParams.get("wardSlug"));
    const keyword = normalizeText(requestUrl.searchParams.get("q"));
    const isExpress = requestUrl.searchParams.get("isExpress");
    const isMatched = requestUrl.searchParams.get("isMatched");

    if (status && normalizeText(item.status) !== status) return false;
    if (categorySlug && normalizeText(item.category?.slug) !== categorySlug) return false;
    if (provinceSlug && normalizeText(item.desiredProvince?.slug) !== provinceSlug) return false;
    if (wardSlug && normalizeText(item.desiredWard?.slug) !== wardSlug) return false;
    if (isExpress !== null && isExpress !== "" && Boolean(item.isExpress) !== (isExpress === "true")) return false;
    if (isMatched !== null && isMatched !== "" && Boolean(item.isMatched) !== (isMatched === "true")) return false;
    if (keyword) {
      const haystack = [
        item.title,
        item.requirementText,
        item.category?.name,
        item.desiredProvince?.name,
        item.desiredWard?.name,
      ]
        .filter(Boolean)
        .map(normalizeText)
        .join(" ");
      if (!haystack.includes(keyword)) return false;
    }

    return true;
  }

  function matchesPropertyFilters(item) {
    const status = normalizeText(requestUrl.searchParams.get("status"));
    const categorySlug = normalizeText(requestUrl.searchParams.get("categorySlug"));
    const provinceSlug = normalizeText(requestUrl.searchParams.get("provinceSlug"));
    const wardSlug = normalizeText(requestUrl.searchParams.get("wardSlug"));
    const keyword = normalizeText(requestUrl.searchParams.get("q"));
    const direction = normalizeText(requestUrl.searchParams.get("direction"));
    const priorityStatus = normalizeText(requestUrl.searchParams.get("priorityStatus"));
    const publishSource = normalizeText(requestUrl.searchParams.get("publishSource"));
    const isBoosted = requestUrl.searchParams.get("isBoosted");
    const isNegotiable = requestUrl.searchParams.get("isNegotiable");

    if (status && normalizeText(item.status) !== status) return false;
    if (categorySlug && normalizeText(item.category?.slug) !== categorySlug) return false;
    if (provinceSlug && normalizeText(item.province?.slug) !== provinceSlug) return false;
    if (wardSlug && normalizeText(item.ward?.slug) !== wardSlug) return false;
    if (direction && normalizeText(item.direction) !== direction) return false;
    if (priorityStatus && normalizeText(item.priorityStatus) !== priorityStatus) return false;
    if (publishSource && normalizeText(item.publishSource) !== publishSource) return false;
    if (isBoosted !== null && isBoosted !== "" && Boolean(item.isBoosted) !== (isBoosted === "true")) return false;
    if (isNegotiable !== null && isNegotiable !== "" && Boolean(item.isNegotiable) !== (isNegotiable === "true")) return false;
    if (keyword) {
      const haystack = [
        item.title,
        item.content,
        item.category?.name,
        item.province?.name,
        item.ward?.name,
      ]
        .filter(Boolean)
        .map(normalizeText)
        .join(" ");
      if (!haystack.includes(keyword)) return false;
    }

    return true;
  }

  if (requestUrl.pathname === "/api/v1/properties" && req.method === "GET") {
    const items = state.properties.filter(matchesPropertyFilters);
    const sortBy = normalizeText(requestUrl.searchParams.get("sortBy"));
    const sortOrder = normalizeText(requestUrl.searchParams.get("sortOrder")) === "asc" ? "asc" : "desc";

    items.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0);
      }
      if (sortBy === "area") {
        return sortOrder === "asc" ? (a.area || 0) - (b.area || 0) : (b.area || 0) - (a.area || 0);
      }
      if (sortBy === "viewcount") {
        return sortOrder === "asc" ? a.viewCount - b.viewCount : b.viewCount - a.viewCount;
      }
      if (sortBy === "prioritystatus") {
        return sortOrder === "asc"
          ? normalizeText(a.priorityStatus).localeCompare(normalizeText(b.priorityStatus))
          : normalizeText(b.priorityStatus).localeCompare(normalizeText(a.priorityStatus));
      }
      return sortOrder === "asc"
        ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    sendList(items);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/properties" && req.method === "POST") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    const body = await context.parseBody(req);
    const item = makeProperty(body, user);
    state.properties.unshift(item);
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/properties/search/by-slug/") && req.method === "GET") {
    const flatSlug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const items = state.properties.filter((item) => {
      const categorySlug = normalizeText(item.category?.slug);
      const provinceSlug = normalizeText(item.province?.slug);
      const wardSlug = normalizeText(item.ward?.slug);
      const computedFlatSlug = [categorySlug, provinceSlug, wardSlug].filter(Boolean).join("-");
      return computedFlatSlug === normalizeText(flatSlug);
    });
    sendList(items);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/properties/slug/") && req.method === "GET") {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const item = state.properties.find((candidate) => candidate.slug === slug);
    if (!item) {
      sendJson(context.res, 404, { message: "Property not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname.match(/^\/api\/v1\/properties\/\d+$/) && req.method === "GET") {
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.properties.find((candidate) => candidate.id === id);
    if (!item) {
      sendJson(context.res, 404, { message: "Property not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/rent-requests" && req.method === "GET") {
    const items = state.rentRequests.filter(matchesRentRequestFilters);
    const sortBy = normalizeText(requestUrl.searchParams.get("sortBy"));
    const sortOrder = normalizeText(requestUrl.searchParams.get("sortOrder")) === "asc" ? "asc" : "desc";

    items.sort((a, b) => {
      if (sortBy === "budget") {
        return sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget;
      }
      if (sortBy === "desiredarea") {
        return sortOrder === "asc" ? a.desiredArea - b.desiredArea : b.desiredArea - a.desiredArea;
      }
      if (sortBy === "viewcount") {
        return sortOrder === "asc" ? a.viewCount - b.viewCount : b.viewCount - a.viewCount;
      }
      return sortOrder === "asc"
        ? new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    sendList(items);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/rent-requests/category/") && req.method === "GET") {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const items = state.rentRequests.filter((item) => normalizeText(item.category?.slug) === normalizeText(slug));
    sendList(items);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/rent-requests/search/by-slug/") && req.method === "GET") {
    const flatSlug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const items = state.rentRequests.filter((item) => {
      const categorySlug = normalizeText(item.category?.slug);
      const provinceSlug = normalizeText(item.desiredProvince?.slug);
      const wardSlug = normalizeText(item.desiredWard?.slug);
      const computedFlatSlug = [categorySlug, provinceSlug, wardSlug].filter(Boolean).join("-");
      return computedFlatSlug === normalizeText(flatSlug);
    });
    sendList(items);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/rent-requests/slug/") && req.method === "GET") {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const item = state.rentRequests.find((candidate) => candidate.slug === slug);
    if (!item) {
      sendJson(context.res, 404, { message: "Rent request not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname.match(/^\/api\/v1\/rent-requests\/\d+$/) && req.method === "GET") {
    const id = Number(requestUrl.pathname.split("/").pop());
    const item = state.rentRequests.find((candidate) => candidate.id === id);
    if (!item) {
      sendJson(context.res, 404, { message: "Rent request not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/rent-requests" && req.method === "POST") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    const body = await context.parseBody(req);
    const item = makeRentRequest(body, user);
    state.rentRequests.unshift(item);
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/me/rent-requests" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    const items = state.rentRequests.filter((item) => item.userId === user.id);
    sendList(items);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/me/properties" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    const items = state.properties.filter((item) => item.userId === user.id);
    sendList(items);
    return true;
  }

  return false;
};
