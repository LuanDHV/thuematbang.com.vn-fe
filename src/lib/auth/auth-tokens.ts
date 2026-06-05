export type TokenPair = {
  accessToken?: string;
  refreshToken?: string;
};

function getRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function parseAuthTokenShape(value: unknown): TokenPair | null {
  const record = getRecord(value);
  if (!record) return null;

  const accessToken = record.accessToken;
  const refreshToken = record.refreshToken;

  if (typeof accessToken !== "string" || accessToken.length === 0) return null;
  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function extractTokenPair(payload: unknown): TokenPair {
  const direct = parseAuthTokenShape(payload);
  if (direct) return direct;

  const wrapped = getRecord(payload)?.data;
  return parseAuthTokenShape(wrapped) ?? {};
}
