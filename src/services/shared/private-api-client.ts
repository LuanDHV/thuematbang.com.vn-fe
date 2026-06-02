import { getPrivateApiBaseUrl } from "@/lib/env";
import { normalizePaginationMeta } from "./validation";
import { ApiResponse } from "@/types/api";

type PrivateApiClientOptions = {
  accessToken: string;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

function createPrivateApiUrl(path: string) {
  const base = getPrivateApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getPrivateApiResponse<T>(
  path: string,
  options: PrivateApiClientOptions,
): Promise<ApiResponse<T>> {
  if (!options.accessToken) {
    throw new Error("Unauthorized");
  }

  const payload = await fetch(createPrivateApiUrl(path), {
    cache: options.cache,
    next:
      options.revalidate || options.tags
        ? {
            revalidate: options.revalidate,
            tags: options.tags,
          }
        : undefined,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${options.accessToken}`,
    },
  }).then(async (response) => {
    const data = await parseJsonSafe(response);

    if (!response.ok) {
      throw new Error(
        typeof data?.message === "string" ? data.message : `Request failed (${response.status})`,
      );
    }

    return data;
  });

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (record.data !== undefined || record.meta !== undefined) {
      return {
        data: record.data as T,
        meta: normalizePaginationMeta(record.meta as never),
        message:
          typeof record.message === "string" ? record.message : undefined,
        statusCode:
          typeof record.statusCode === "number" ? record.statusCode : undefined,
      };
    }

    if (record.items !== undefined || record.pagination !== undefined) {
      return {
        data: (record.items as T) ?? ([] as unknown as T),
        meta: normalizePaginationMeta(record.pagination as never),
        message:
          typeof record.message === "string" ? record.message : undefined,
        statusCode:
          typeof record.statusCode === "number" ? record.statusCode : undefined,
      };
    }
  }

  return {
    data: payload as T,
  };
}
