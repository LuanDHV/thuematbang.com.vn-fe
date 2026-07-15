module.exports = async function handleMediaRoutes(context) {
  const { req, requestUrl, origin, parseBody, sendJson, envelope, getCurrentUserFromRequest, baseUrl } =
    context;

  if (requestUrl.pathname === "/api/v1/media/signature" && req.method === "POST") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }

    const body = await parseBody(req);
    const resourceType = String(body.resourceType || "properties");
    const draftId = String(body.draftId || "draft");
    const timestamp = Math.floor(Date.now() / 1000);
    sendJson(
      context.res,
      200,
      envelope({
        cloudName: "mock-cloud",
        apiKey: "mock-api-key",
        folder: `${resourceType}/drafts/${draftId}`,
        timestamp,
        signature: `mock-signature-${timestamp}`,
        uploadUrl: `${baseUrl}/cloudinary/upload`,
      }),
      origin,
    );
    return true;
  }

  if (requestUrl.pathname === "/api/v1/media" && req.method === "DELETE") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope({ ok: true, message: "Deleted" }), origin);
    return true;
  }

  return false;
};
