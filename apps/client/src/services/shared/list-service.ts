export type QueryValue = string | number | boolean | null | undefined;

export type ListParams<TFilters extends Record<string, QueryValue>> = {
  filters?: TFilters;
  page?: number;
  limit?: number;
};

// Append only meaningful query values so empty filter fields do not leak into the URL.
export function appendQuery(
  query: URLSearchParams,
  values?: Record<string, QueryValue>,
) {
  if (!values) return;
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
}

// Build the canonical list endpoint path with optional filters and pagination.
export function buildListPath<TFilters extends Record<string, QueryValue>>(
  basePath: string,
  params: ListParams<TFilters> = {},
) {
  const query = new URLSearchParams();
  appendQuery(query, params.filters);
  if (typeof params.page === "number") query.set("page", String(params.page));
  if (typeof params.limit === "number") query.set("limit", String(params.limit));

  const queryText = query.toString();
  return queryText ? `${basePath}?${queryText}` : basePath;
}

// Build a list endpoint path whose primary filter is encoded in the path itself.
export function buildScopedListPath<TFilters extends Record<string, QueryValue>>(
  basePath: string,
  scopeValue: string,
  params: Omit<ListParams<TFilters>, "filters"> = {},
) {
  const query = new URLSearchParams();
  if (typeof params.page === "number") query.set("page", String(params.page));
  if (typeof params.limit === "number") query.set("limit", String(params.limit));

  const queryText = query.toString();
  const scopedBase = `${basePath}/${encodeURIComponent(scopeValue)}`;
  return queryText ? `${scopedBase}?${queryText}` : scopedBase;
}

// Generate stable cache tags for list reads so invalidation can target one slice.
export function buildListTags(
  resource: string,
  options?: {
    page?: number;
    limit?: number;
    scope?: { key: string; value: string };
  },
) {
  if (options?.scope) {
    return [
      resource,
      `${resource}-${options.scope.key}-${encodeURIComponent(options.scope.value)}-${options.page ?? "all"}-${options.limit ?? "all"}`,
    ];
  }
  if (typeof options?.page === "number" || typeof options?.limit === "number") {
    return [resource, `${resource}-page-${options?.page ?? "all"}-${options?.limit ?? "all"}`];
  }
  return [resource];
}
