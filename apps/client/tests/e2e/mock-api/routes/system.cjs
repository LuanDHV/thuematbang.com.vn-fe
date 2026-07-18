module.exports = async function handleSystemRoutes(context) {
  const { req, requestUrl, origin, parseBody, sendJson } = context;

  if (req.method === "POST" && requestUrl.pathname === "/cloudinary/upload") {
    await parseBody(req);
    sendJson(
      context.res,
      200,
      {
        secure_url: "/imgs/fallback.png",
        public_id: `properties/draft/${Date.now()}`,
        width: 1600,
        height: 900,
        bytes: 1024,
      },
      origin,
    );
    return true;
  }

  return false;
};
