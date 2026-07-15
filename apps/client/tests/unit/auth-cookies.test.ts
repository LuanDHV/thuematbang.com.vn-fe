/**
 * @jest-environment node
 */

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/server/auth-cookies";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/lib/app-env", () => ({
  isProductionAppEnv: jest.fn(),
}));

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

const mockResponseCookies = {
  set: jest.fn(),
};

let mockIsProduction: () => boolean;

describe("auth-cookies", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockIsProduction = () => false;

    const { isProductionAppEnv } = await import("@/lib/app-env");
    (isProductionAppEnv as jest.Mock).mockImplementation(() => mockIsProduction());

    const { cookies } = await import("next/headers");
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
  });

  it("readAuthCookies returns token values from cookie store", async () => {
    mockCookieStore.get.mockImplementation((name: string) => {
      if (name === ACCESS_TOKEN_COOKIE) return { value: "my-access" };
      if (name === REFRESH_TOKEN_COOKIE) return { value: "my-refresh" };
      return undefined;
    });

    const { readAuthCookies } = await import("@/lib/server/auth-cookies");
    const result = await readAuthCookies();

    expect(result.accessToken).toBe("my-access");
    expect(result.refreshToken).toBe("my-refresh");
  });

  it("readAuthCookies returns undefined for missing tokens", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const { readAuthCookies } = await import("@/lib/server/auth-cookies");
    const result = await readAuthCookies();

    expect(result.accessToken).toBeUndefined();
    expect(result.refreshToken).toBeUndefined();
  });

  it("writeAuthCookies sets both tokens with correct options", async () => {
    const { writeAuthCookies } = await import("@/lib/server/auth-cookies");
    await writeAuthCookies({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      "new-access",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 86400,
      }),
    );

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      "new-refresh",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 2592000,
      }),
    );
  });

  it("writeAuthCookies sets secure flag in production", async () => {
    mockIsProduction = () => true;

    const { writeAuthCookies } = await import("@/lib/server/auth-cookies");
    await writeAuthCookies({ accessToken: "secure-access" });

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      "secure-access",
      expect.objectContaining({ secure: true }),
    );
  });

  it("deleteAuthCookies expires both tokens with maxAge 0", async () => {
    const { deleteAuthCookies } = await import("@/lib/server/auth-cookies");
    await deleteAuthCookies();

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      "",
      expect.objectContaining({ maxAge: 0 }),
    );

    expect(mockCookieStore.set).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      "",
      expect.objectContaining({ maxAge: 0 }),
    );
  });
});
