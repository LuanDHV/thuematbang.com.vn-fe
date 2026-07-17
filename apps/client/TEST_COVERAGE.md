# Test Coverage Matrix

Ma trận sống cho coverage hiện tại của `apps/client`.

## P1 Browser Journeys

| Feature area | Coverage | Files |
| --- | --- | --- |
| Auth flow | Login, protected create route, logout, register, cookie verification | `tests/e2e/auth-flow.spec.ts` |
| Listing create | Property create with image, rent request with budget, negotiable rent request | `tests/e2e/listing-create.spec.ts` |
| User dashboard status | Rejected revision flow, pending transition, hidden actions after publish | `tests/e2e/user-dashboard-status.spec.ts` |

## P2 Smoke

| Feature area | Coverage | Files |
| --- | --- | --- |
| Auth page shell | Heading/action button route smoke | `tests/e2e/auth-page.spec.ts` |

## Unit Boundary

| Feature area | Coverage | Files |
| --- | --- | --- |
| Auth service/cookies | Payload unwrap, cookie options, secure flag | `tests/unit/auth-service.test.ts`, `tests/unit/auth-cookies.test.ts` |
| Server API client | Refresh/retry, unauthorized behavior, server auth boundary | `tests/unit/server-api-client.test.ts` |
| Validation/schema helpers | Pagination, ensureArray, negotiable rent request branches | `tests/unit/validation.test.ts` |
| Formatting/filtering/text | Format helpers, listing filter helpers, Vietnamese text normalization, generic utils | `tests/unit/format.test.ts`, `tests/unit/listing-filter.test.ts`, `tests/unit/text-normalize.test.ts`, `tests/unit/utils.test.ts` |
| Maps and listing matches | Google map helper, listing match status helper | `tests/unit/google-map.test.ts`, `tests/unit/listing-match-status.test.ts` |

## Component/Hook Boundary

| Feature area | Coverage | Files |
| --- | --- | --- |
| Auth forms | Empty validation, submit redirect, admin variant/duplicate mapping | `tests/components/auth/LoginForm.test.tsx`, `tests/components/auth/SignupForm.test.tsx` |
| Listing form | Prefill, defaults, loading, logged-out prompt, view-only mode | `tests/components/listing-form/PropertyCreateForm.test.tsx` |
| Common UI | Favorite button, pagination, password input, poster contact card | `tests/components/common/FavoriteButton.test.tsx`, `tests/components/common/Pagination.test.tsx`, `tests/components/common/PasswordInput.test.tsx`, `tests/components/common/PosterContactCard.test.tsx` |
| Filters | Listing filter toolbar behavior | `tests/components/listing-filter/ListingFilterToolbar.test.tsx` |
| Hooks/navigation | Auth logout cache cleanup, favorite navigation | `tests/hooks/use-auth.test.tsx`, `tests/lib/favorites/favorite-navigation.test.ts` |

## Known Gaps

- Admin operator app tests are outside `apps/client`; see `apps/admin` docs when adding admin coverage.
- Static pages and SEO rendering currently rely mostly on route/service behavior and smoke coverage, not dedicated component tests.
- Public detail pages have no dedicated Playwright journeys unless they overlap listing create/dashboard flows.

Update this file whenever a feature area gains or loses meaningful coverage.
