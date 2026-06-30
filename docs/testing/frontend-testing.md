# Frontend Testing

This document describes the current frontend test strategy and suite in `thuematbang.com.vn-fe`.

The frontend strategy is intentionally split:

- `Unit tests`: protect services, helpers, hooks, and schema logic.
- `Component tests`: protect form behavior, render states, error mapping, and interaction branches that do not need a full browser.
- `Browser E2E`: protect auth, route gating, and primary listing journeys through the real browser, FE route handlers, and mock API server.

## Commands

```bash
npm test
npm run test:e2e
```

## Priority Levels

- `P1`: auth, property, and rent-request primary flows.
- `P2`: smoke/platform/supporting regression flows outside the current priority domains.

## Browser E2E Priority

### `tests/e2e/auth-flow.spec.ts` (`P1`)

- Focus: customer login, access to protected create pages, logout, and customer register with cookie verification.
- Why E2E: this is the top-level browser auth contract and verifies the FE auth route handlers, cookie bridge, and protected-route gating in a real browser.
- Review when: auth route handlers, login/register redirect behavior, auth cookies, or route gating change.

### `tests/e2e/listing-create.spec.ts` (`P1`)

- Focus: property creation with image upload, rent-request creation with budget, and negotiable rent-request creation without budget.
- Why E2E: this is the main end-user listing journey and catches real browser interactions around form state, submit actions, route changes, and success-dialog visibility.
- Review when: create forms, create server actions, revalidation behavior, or create-page redirects/success UX change.

### `tests/e2e/admin-smoke.spec.ts` (`P1`)

- Focus: anonymous/admin access behavior around `/admin`.
- Why E2E: admin route gating is user-visible and depends on FE server-side auth resolution, not only local component logic.
- Review when: admin shell auth behavior, route guard, or admin layout auth resolution changes.

### `tests/e2e/user-dashboard-status.spec.ts` (`P1`)

- Focus: rejected property/rent-request revision flow and the transition back to pending, plus hidden actions after publish.
- Why E2E: verifies a real user workflow across UI state, API state, and status transitions.
- Review when: dashboard status UI or listing moderation/revision flow changes.

## Browser Smoke and Supporting

### `tests/e2e/auth-page.spec.ts` (`P2`)

- Focus: auth page shell renders the expected heading and action button.
- Why E2E: lightweight smoke for route and shell availability only.
- Review when: auth shell or route structure changes.

This file should stay documented as a smoke check, not as a business-critical flow.

## Unit Tests For Services, Helpers, and Hooks

### Services and boundaries

- `tests/unit/auth-service.test.ts`
  - Covers auth client payload unwrapping.
- `tests/unit/server-api-client.test.ts`
  - Covers refresh-and-retry behavior, unauthorized handling, and server-side auth boundary rules.
- `tests/unit/auth-cookies.test.ts`
  - Covers cookie read/write/delete behavior, production secure flag, and cookie option consistency.
- `tests/unit/validation.test.ts`
  - Covers pagination normalization, ensureArray, and negotiable rent-request schema branches.

### Helpers

- `tests/unit/format.test.ts`
- `tests/unit/listing-filter.test.ts`
- `tests/unit/text-normalize.test.ts`
- `tests/unit/utils.test.ts`

These files protect pure formatting, filtering, text normalization, and utility behavior. Keep them at the unit layer; do not move this kind of coverage into Playwright.

### Hooks

- `tests/hooks/use-auth.test.tsx`
  - Covers logout cache clearing in React Query.

## Component Tests For Forms, Common UI, and Admin UI

### Auth forms

- `tests/components/auth/LoginForm.test.tsx`
  - Covers empty validation, submit redirect, and admin-variant redirect behavior.
- `tests/components/auth/SignupForm.test.tsx`
  - Covers empty validation, successful submit redirect, and duplicate-error message mapping.

### Listing forms

- `tests/components/listing-form/PropertyCreateForm.test.tsx`
  - Covers auth prefill, default value preservation, loading state, logged-out prompt, heading/description render, and view-only mode.

### Shared/common/admin components

- `tests/components/cms/admin/AdminDashboardOverview.test.tsx`
- `tests/components/cms/admin/AdminUsersTable.test.tsx`
- `tests/components/common/Pagination.test.tsx`
- `tests/components/common/PasswordInput.test.tsx`
- `tests/components/common/PosterContactCard.test.tsx`
- `tests/components/listing-filter/ListingFilterToolbar.test.tsx`

These files protect UI render states and interaction branches that are valuable but not worth moving into browser E2E.

## Frontend Testing Rules

- Browser E2E is for auth, route protection, and primary listing journeys.
- Schema, render-state, error-mapping, and branch-heavy form behavior should stay in unit/component tests.
- Do not add Playwright coverage just to test a validation branch or error string mapping.
- If a refactor touches:
  - auth route handlers or cookie bridges -> review `auth-flow.spec.ts`, `server-api-client.test.ts`, and `auth-cookies.test.ts`
  - property or rent-request create flows -> review `listing-create.spec.ts` plus the related schema/component tests
  - admin access behavior -> review `admin-smoke.spec.ts` first
  - dashboard moderation/revision behavior -> review `user-dashboard-status.spec.ts` first

## Recommended Next Additions

Only add these when the related area is actively changing:

- direct unit tests for FE auth route handlers if auth/session refactors become deeper
- more component/integration coverage for admin listing edit screens before adding more Playwright

Not recommended right now:

- expanding Playwright to every CRUD branch
- adding browser E2E for small validation permutations
- trimming current `P1` suites for speed before there is data showing waste or duplication
