module.exports = async function handleContentRoutes(context) {
  const {
    req,
    requestUrl,
    origin,
    state,
    clone,
    sendJson,
    envelope,
    getCurrentUserFromRequest,
  } = context;

  if (!requestUrl.pathname.startsWith("/api/v1/leads")) {
    return false;
  }

  if (requestUrl.pathname === "/api/v1/leads" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    if (user.role !== "ADMIN") {
      sendJson(context.res, 403, { message: "Forbidden" }, origin);
      return true;
    }

    sendJson(
      context.res,
      200,
      {
        data: clone(state.leads),
        meta: {
          total: state.leads.length,
          currentPage: 1,
          limit: state.leads.length || 1,
          totalPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
      origin,
    );
    return true;
  }

  if (requestUrl.pathname === "/api/v1/leads" && req.method === "POST") {
    const body = await context.parseBody(req);
    const user = getCurrentUserFromRequest(req);
    const item = {
      id: state.leads.length + 1,
      fullName: body.fullName || body.name || "Lead demo",
      phone: body.phone || null,
      userId: user ? user.id : (body.userId ?? null),
      propertyId: body.propertyId ?? null,
      rentRequestId: body.rentRequestId ?? null,
      status: body.status || "NEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    state.leads.unshift(item);
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  const idMatch = requestUrl.pathname.match(/^\/api\/v1\/leads\/(\d+)$/);
  if (idMatch && req.method === "GET") {
    const item = state.leads.find(
      (candidate) => candidate.id === Number(idMatch[1]),
    );
    if (!item) {
      sendJson(context.res, 404, { message: "Lead not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (idMatch && req.method === "PATCH") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    if (user.role !== "ADMIN") {
      sendJson(context.res, 403, { message: "Forbidden" }, origin);
      return true;
    }

    const item = state.leads.find(
      (candidate) => candidate.id === Number(idMatch[1]),
    );
    if (!item) {
      sendJson(context.res, 404, { message: "Lead not found" }, origin);
      return true;
    }
    const body = await context.parseBody(req);
    item.status = body.status || item.status;
    item.fullName = body.fullName || item.fullName;
    item.phone = body.phone || item.phone;
    item.propertyId = body.propertyId ?? item.propertyId ?? null;
    item.rentRequestId = body.rentRequestId ?? item.rentRequestId ?? null;
    item.updatedAt = new Date().toISOString();
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  if (idMatch && req.method === "DELETE") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    if (user.role !== "ADMIN") {
      sendJson(context.res, 403, { message: "Forbidden" }, origin);
      return true;
    }

    const index = state.leads.findIndex(
      (candidate) => candidate.id === Number(idMatch[1]),
    );
    if (index < 0) {
      sendJson(context.res, 404, { message: "Lead not found" }, origin);
      return true;
    }
    const [removed] = state.leads.splice(index, 1);
    sendJson(context.res, 200, envelope(clone(removed)), origin);
    return true;
  }

  return false;
};
