module.exports = async function handleLocationsRoutes(context) {
  const { req, requestUrl, origin, state, clone, sendJson, envelope } = context;

  if (requestUrl.pathname === "/api/v1/locations/provinces" && req.method === "GET") {
    sendJson(context.res, 200, envelope(clone(state.provinces)), origin);
    return true;
  }

  if (
    requestUrl.pathname.startsWith("/api/v1/locations/provinces/") &&
    requestUrl.pathname.endsWith("/wards") &&
    req.method === "GET"
  ) {
    const provinceId = Number(requestUrl.pathname.split("/")[5]);
    const items = state.wards.filter((ward) => ward.provinceId === provinceId);
    sendJson(context.res, 200, envelope(clone(items)), origin);
    return true;
  }

  return false;
};
