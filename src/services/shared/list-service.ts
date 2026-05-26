export type QueryValue = string | number | boolean | null | undefined;

export type ListParams<TFilters extends Record<string, QueryValue>> = {
  filters?: TFilters;
  page?: number;
  limit?: number;
};

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
