let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getRefreshToken = (): string | null =>
  localStorage.getItem("admin_refreshToken");
export const setRefreshToken = (token: string): void =>
  localStorage.setItem("admin_refreshToken", token);
export const clearRefreshToken = (): void =>
  localStorage.removeItem("admin_refreshToken");

export const clearAuthState = (): void => {
  accessToken = null;
  clearRefreshToken();
};
