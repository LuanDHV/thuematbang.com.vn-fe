module.exports = async function handleSearchRoutes(context) {
  const { requestUrl, origin, sendJson, envelope, suggestByKeyword } = context;

  if (requestUrl.pathname !== "/api/v1/public-search/suggestions") {
    return false;
  }

  const keyword = String(requestUrl.searchParams.get("keyword") || "");
  const contextResource = String(requestUrl.searchParams.get("contextResource") || "property");
  const limit = Math.max(1, Number(requestUrl.searchParams.get("limit") || 10));
  const suggestions = suggestByKeyword(keyword, contextResource).slice(0, limit);
  sendJson(context.res, 200, envelope(suggestions), origin);
  return true;
};
