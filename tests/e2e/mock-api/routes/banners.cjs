module.exports = async function handleBannerRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/banners" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.banners),
      meta: {
        total: state.banners.length,
        currentPage: 1,
        limit: state.banners.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/banners/page/") && req.method === "GET") {
    const pageKey = decodeURIComponent(requestUrl.pathname.split("/").pop() || "");
    const items = state.banners.filter((banner) => banner.page === pageKey);
    sendJson(context.res, 200, envelope({ page: pageKey, banners: clone(items) }), origin);
    return true;
  }

  return false;
};
