// Normalize URLSearchParams-like inputs before pagination helpers consume them.
function serializeSearch(search: string | { toString(): string }) {
  return typeof search === "string" ? search : search.toString();
}

// Build a paginated URL while preserving existing search params.
export function buildPaginationUrl(
  pathname: string,
  search: string,
  page: number,
) {
  const nextParams = new URLSearchParams(search);

  if (page <= 1) {
    nextParams.delete("page");
  } else {
    nextParams.set("page", String(page));
  }

  const query = nextParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

// Return a bounded page-change callback for CMS tables and paginated list views.
export function createPaginationChangeHandler(
  navigate: (href: string) => void,
  pathname: string,
  search: string | { toString(): string },
  totalPages?: number,
) {
  const serializedSearch = serializeSearch(search);

  return (page: number) => {
    if (page < 1 || (typeof totalPages === "number" && page > totalPages)) {
      return;
    }

    navigate(buildPaginationUrl(pathname, serializedSearch, page));
  };
}
