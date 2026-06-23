# Test Coverage

## Current Testing Stack

- `Jest` for unit and component/integration tests
- `React Testing Library` for DOM assertions and interaction flows
- `MSW` for request-level API mocking in tests
- `Playwright` for browser-level journeys

## How To Run

```bash
npm run test
npm run test:coverage
npm run test:e2e
```

## Current Coverage Baseline

| Area | Unit | Component / Integration | E2E | Notes |
|---|---:|---:|---:|---|
| `src/lib/format.ts` | Yes | No | No | Locale formatting helpers |
| `src/lib/text/text-normalize.ts` | Yes | No | No | Slug-safe normalization helpers |
| `src/lib/utils.ts` | Yes | No | No | Tailwind class merge helper |
| `src/services/shared/validation.ts` | Yes | No | No | Array and pagination normalization helpers |
| `src/services/shared/server-api-client.ts` | Yes | No | No | Boundary request/retry logic |
| `src/services/auth.service.ts` | Yes | No | No | MSW-backed request test |
| `src/hooks/use-auth.ts` | Yes | No | No | React Query logout mutation |
| `src/components/auth/LoginForm.tsx` | No | Yes | No | Validation and redirect flow |
| `src/components/auth/SignupForm.tsx` | No | Yes | No | Validation and submit flow |
| `src/components/listing-filter/ListingFilterToolbar.tsx` | No | Yes | No | Filter drawer shell and search input behavior |
| `src/components/cms/admin/AdminUsersTable.tsx` | No | Yes | No | Table render, search field, and row actions |
| `src/components/cms/admin/AdminDashboardOverview.tsx` | No | Yes | No | Empty-state dashboard shell |
| `src/components/common/Pagination.tsx` | No | Yes | No | Click navigation and disabled state |
| `src/components/common/PasswordInput.tsx` | No | Yes | No | Visibility toggle behavior |
| `src/app/(auth)/dang-nhap/page.tsx` | No | No | Yes | Playwright smoke for auth page shell |

## What Still Needs Coverage

The current baseline is intentionally small and meant to prove the stack first.

- auth forms
- listing create/edit forms
- CMS admin/user screens
- richer route-handler and cookie flows
- broader Playwright journeys for create and admin guards

## Maintenance Rule

- add or update test coverage whenever a feature changes behavior
- if a feature is deliberately out of scope for the current release, record that in the PR and update this file later
