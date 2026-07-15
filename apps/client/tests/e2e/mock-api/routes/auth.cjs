module.exports = async function handleAuthRoutes(context) {
  const {
    req,
    requestUrl,
    origin,
    state,
    nowIso,
    parseBody,
    sendJson,
    envelope,
    issueTokenPair,
    getCurrentUserFromRequest,
    getUserByRefreshToken,
  } = context;

  if (requestUrl.pathname === "/api/v1/auth/login" && req.method === "POST") {
    const body = await parseBody(req);
    const identifier = String(body.identifier || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "").trim();
    const isCustomerLogin =
      identifier === "customer@example.com" && password.includes("Password123!");
    const isAdminLogin =
      identifier === "admin@example.com" && password.includes("Admin123!");
    const user =
      state.users.find(
        (item) =>
          (item.email.toLowerCase() === identifier || item.phone === identifier) &&
          (isCustomerLogin || isAdminLogin),
      ) ||
      (isAdminLogin
        ? state.users.find((item) => item.role === "ADMIN")
        : null) ||
      (isCustomerLogin
        ? state.users.find((item) => item.role === "CUSTOMER")
        : null);

    if (!user) {
      sendJson(context.res, 401, { message: "Invalid credentials" }, origin);
      return true;
    }

    const tokens = issueTokenPair(user);
    sendJson(
      context.res,
      200,
      {
        ...tokens,
        message: "Đăng nhập thành công",
        user,
      },
      origin,
    );
    return true;
  }

  if (requestUrl.pathname === "/api/v1/auth/register" && req.method === "POST") {
    const body = await parseBody(req);
    const user = {
      id: state.nextUserId++,
      fullName: body.fullName || "Người dùng mới",
      email: body.email || `user-${Date.now()}@example.com`,
      phone: body.phone || "0901999999",
      role: "CUSTOMER",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    state.users.push(user);
    const tokens = issueTokenPair(user);
    sendJson(
      context.res,
      200,
      {
        ...tokens,
        message: "Đăng ký thành công",
        user,
      },
      origin,
    );
    return true;
  }

  if (requestUrl.pathname === "/api/v1/auth/logout" && req.method === "POST") {
    sendJson(context.res, 200, { ok: true, message: "Đăng xuất thành công" }, origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/auth/refresh" && req.method === "POST") {
    const body = await parseBody(req);
    const user = getUserByRefreshToken(String(body.refreshToken || ""));
    if (!user) {
      sendJson(context.res, 401, { message: "Invalid refresh token" }, origin);
      return true;
    }
    sendJson(context.res, 200, { ...issueTokenPair(user), user }, origin);
    return true;
  }

  if (requestUrl.pathname === "/api/v1/users/me" && req.method === "GET") {
    const user = getCurrentUserFromRequest(req);
    if (!user) {
      sendJson(context.res, 401, { message: "Unauthorized" }, origin);
      return true;
    }
    sendJson(context.res, 200, envelope(user), origin);
    return true;
  }

  return false;
};
