export type ServerSearchParams =
  | Record<string, string | string[] | undefined>
  | undefined;

export function resolvePaginationServer(searchParams: ServerSearchParams) {
  const pageValue = searchParams?.page;
  const rawPage = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const nextPage = Number.parseInt(rawPage ?? "1", 10);

  return Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1;
}

export function resolveSearchParamValue(
  searchParams: ServerSearchParams,
  key: string,
) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}
