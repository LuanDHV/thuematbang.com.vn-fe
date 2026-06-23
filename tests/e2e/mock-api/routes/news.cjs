module.exports = async function handleNewsRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/news" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.news),
      meta: {
        total: state.news.length,
        currentPage: 1,
        limit: state.news.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/news/slug/") && req.method === "GET") {
    const slug = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const item = state.news.find((news) => news.slug === slug);
    if (!item) {
      sendJson(context.res, 404, { message: "News not found" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(clone(item)), origin);
    return true;
  }

  return false;
};
