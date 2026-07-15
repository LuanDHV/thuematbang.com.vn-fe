module.exports = async function handleAdminRoutes(context) {
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

  if (!requestUrl.pathname.startsWith("/api/v1/admin/")) {
    return false;
  }

  const user = getCurrentUserFromRequest(req);
  if (!user) {
    sendJson(context.res, 401, { message: "Unauthorized" }, origin);
    return true;
  }
  if (user.role !== "ADMIN") {
    sendJson(context.res, 403, { message: "Forbidden" }, origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/admin/users" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.users),
      meta: {
        total: state.users.length,
        currentPage: 1,
        limit: state.users.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/admin/users/lookup" && req.method === "GET") {
    const email = String(requestUrl.searchParams.get("email") || "").trim().toLowerCase();
    const phone = String(requestUrl.searchParams.get("phone") || "").trim();
    const item = state.users.find((candidate) => {
      if (email) return candidate.email.toLowerCase() === email;
      if (phone) return candidate.phone === phone;
      return false;
    });
    if (!item) {
      sendJson(context.res, 404, { message: "User not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  const roleMatch = requestUrl.pathname.match(/^\/api\/v1\/admin\/users\/(\d+)\/role$/);
  if (roleMatch && req.method === "PATCH") {
    const id = Number(roleMatch[1]);
    const item = state.users.find((candidate) => candidate.id === id);
    if (!item) {
      sendJson(context.res, 404, { message: "User not found" }, origin);
      return true;
    }
    const body = await context.parseBody(req);
    item.role = body.role || item.role;
    item.updatedAt = new Date().toISOString();
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  return false;
};
