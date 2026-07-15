"use server";

import { publicSearchService } from "@/services/public-search.service";

type PublicSearchSuggestionsActionParams = {
  contextResource?: "property" | "rent-request";
  keyword: string;
  limit?: number;
};

export async function getPublicSearchSuggestionsAction(
  params: PublicSearchSuggestionsActionParams,
) {
  const response = await publicSearchService.getSuggestions(params);
  return response.data ?? [];
}
