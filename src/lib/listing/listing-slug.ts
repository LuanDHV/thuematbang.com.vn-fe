import { compactSlugToken } from "@/lib/text/text-normalize";

// Build a stable SEO slug from a title or a user-edited slug fragment.
export function buildListingSlug(value: string) {
  return compactSlugToken(value);
}
