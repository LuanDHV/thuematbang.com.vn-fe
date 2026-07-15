import { http, HttpResponse } from "msw";

const apiBase = "http://127.0.0.1:3000/api/v1";

export const handlers = [
  http.post(`${apiBase}/auth/logout`, () =>
    HttpResponse.json({
      data: {
        ok: true,
        message: "Đăng xuất thành công",
      },
    }),
  ),
  http.get(`${apiBase}/auth/me`, () =>
    HttpResponse.json({
      data: {
        id: 1,
        fullName: "Test User",
        email: "test@example.com",
        role: "CUSTOMER",
      },
    }),
  ),
];
