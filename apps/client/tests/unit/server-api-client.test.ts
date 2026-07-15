/**
 * @jest-environment node
 */

const mockReadAuthCookies = jest.fn();
const mockWriteAuthCookies = jest.fn();
const mockDeleteAuthCookies = jest.fn();

jest.mock("@/lib/env", () => ({
  getPrivateApiBaseUrl: () => "http://api.test/api/v1",
}));

jest.mock("@/lib/server/auth-cookies", () => ({
  readAuthCookies: (...args: unknown[]) => mockReadAuthCookies(...args),
  writeAuthCookies: (...args: unknown[]) => mockWriteAuthCookies(...args),
  deleteAuthCookies: (...args: unknown[]) => mockDeleteAuthCookies(...args),
}));

import { requestServerApi } from "@/services/shared/server-api-client";

describe("requestServerApi", () => {
  beforeEach(() => {
    mockReadAuthCookies.mockResolvedValue({
      accessToken: "old-access",
      refreshToken: "old-refresh",
    });
    mockWriteAuthCookies.mockResolvedValue(undefined);
    mockDeleteAuthCookies.mockResolvedValue(undefined);
  });

  it("refreshes the token and retries the request when the first call returns 401", async () => {
    let callCount = 0;
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      callCount += 1;
      const url = String(input);

      if (url.endsWith("/auth/refresh")) {
        return new Response(
          JSON.stringify({
            data: {
              accessToken: "new-access",
              refreshToken: "new-refresh",
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      if (callCount === 1) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify({ data: { id: 1 } }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }) as typeof fetch;

    await expect(
      requestServerApi<{ id: number }>("/users/me", {
        auth: "required",
        mutateAuthCookies: true,
      }),
    ).resolves.toEqual({
      data: { id: 1 },
    });

    expect(mockWriteAuthCookies).toHaveBeenCalledWith({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
  });

  it("throws unauthorized when no auth cookies exist", async () => {
    mockReadAuthCookies.mockResolvedValueOnce({
      accessToken: undefined,
      refreshToken: undefined,
    });

    await expect(
      requestServerApi("/users/me", { auth: "required" }),
    ).rejects.toMatchObject({
      status: 401,
    });
  });
});
