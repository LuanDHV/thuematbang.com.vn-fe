import "server-only";

import { requestServerApi } from "./shared/server-api-client";
import { PublicSearchSuggestion } from "@/types/public-search";

export type PublicSearchSuggestionParams = {
  contextResource?: "property" | "rent-request";
  keyword: string;
  limit?: number;
};

function buildPublicSearchSuggestionPath(
  params: PublicSearchSuggestionParams,
) {
  const searchParams = new URLSearchParams();

  if (params.contextResource) {
    searchParams.set("contextResource", params.contextResource);
  }

  if (params.keyword.trim()) {
    searchParams.set("keyword", params.keyword.trim());
  }

  if (typeof params.limit === "number") {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `/public-search/suggestions?${query}` : "/public-search/suggestions";
}

export const publicSearchService = {
  getSuggestions: async (params: PublicSearchSuggestionParams) =>
    requestServerApi<PublicSearchSuggestion[]>(
      buildPublicSearchSuggestionPath(params),
      {
        cache: "no-store",
        tags: [
          "public-search-suggestions",
          params.contextResource ?? "property",
          params.keyword.trim(),
          String(params.limit ?? 10),
        ],
      },
    ),
};
