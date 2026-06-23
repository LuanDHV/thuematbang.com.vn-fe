/**
 * @jest-environment node
 */

import { authService } from "@/services/auth.service";

describe("authService", () => {
  const apiBase = "http://127.0.0.1:3000/api/v1";

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = apiBase;
  });

  it("logout unwraps the backend payload", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            ok: true,
            message: "Đăng xuất thành công",
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    ) as typeof fetch;

    await expect(authService.logout()).resolves.toEqual({
      ok: true,
      message: "Đăng xuất thành công",
    });
  });
});
