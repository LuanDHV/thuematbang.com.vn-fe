module.exports = async function handleSeoContentRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/seo-contents" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.seoContents),
      meta: {
        total: state.seoContents.length,
        currentPage: 1,
        limit: state.seoContents.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/seo-contents/page/") && req.method === "GET") {
    const page = decodeURIComponent(requestUrl.pathname.split("/").pop() || "home");
    const rootPath = page === "home" ? "/" : `/${page}`;
    const item =
      state.seoContents.find((entry) => entry.targetPath === rootPath) ||
      state.seoContents.find((entry) => entry.page === page) ||
      null;
    sendJson(context.res, 200, envelope(item ? clone(item) : null), origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/seo-contents/resolve" && req.method === "GET") {
    const rawPath = requestUrl.searchParams.get("path") || "/";
    const normalizedPath =
      rawPath.length > 1 ? rawPath.replace(/\/+$/g, "") : rawPath;
    const [rootSegment] = normalizedPath.split("/").filter(Boolean);
    const rootPath = rootSegment ? `/${rootSegment}` : "/";
    const item =
      state.seoContents.find(
        (entry) => entry.isActive !== false && entry.targetPath === normalizedPath,
      ) ||
      state.seoContents.find(
        (entry) => entry.isActive !== false && entry.targetPath === rootPath,
      ) ||
      null;
    sendJson(
      context.res,
      200,
      envelope(item ? clone({ ...item, matchedPath: item.targetPath }) : null),
      origin,
    );
    return true;
  }

  return false;
};
