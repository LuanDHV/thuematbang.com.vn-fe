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

  if (requestUrl.pathname === "/api/v1/properties" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.properties),
      meta: {
        total: state.properties.length,
        currentPage: 1,
        limit: state.properties.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
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

  return false;
};
