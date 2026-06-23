module.exports = async function handleFaqRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/faqs" && req.method === "GET") {
    sendJson(context.res, 200, {
      data: clone(state.faqs),
      meta: {
        total: state.faqs.length,
        currentPage: 1,
        limit: state.faqs.length || 1,
        totalPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }, origin);
    return true;
  }

  if (requestUrl.pathname.startsWith("/api/v1/faqs/page/") && req.method === "GET") {
    const page = decodeURIComponent(requestUrl.pathname.split("/").pop() || "home");
    const items = state.faqs.filter((faq) => faq.page === page);
    sendJson(context.res, 200, envelope({ page, faqs: clone(items) }), origin);
    return true;
  }

  return false;
};
