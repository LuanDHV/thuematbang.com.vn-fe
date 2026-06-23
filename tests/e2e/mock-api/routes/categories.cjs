module.exports = async function handleCategoryRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/categories" && req.method === "GET") {
    const type = String(requestUrl.searchParams.get("type") || "");
    const items = type ? state.categories.filter((item) => item.type === type) : state.categories;
    sendJson(context.res, 200, envelope(clone(items)), origin);
    return true;
  }

  return false;
};
