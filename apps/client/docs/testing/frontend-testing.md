# Frontend Testing

Tài liệu này mô tả test strategy hiện tại của `apps/client`.

## 1. Chiến Lược

Client app chia test thành:

- `Unit tests`: services, helpers, schemas, cookie/server boundary logic.
- `Component tests`: form behavior, render states, error mapping, common UI, user interactions không cần browser thật.
- `Hook tests`: React Query/Zustand-facing hook behavior.
- `Browser E2E`: auth, route gating, listing create và user dashboard journeys qua Playwright với mock API server.

Không mở rộng Playwright cho mọi CRUD branch nhỏ. Branch-heavy validation và error string mapping nên nằm ở unit/component tests.

## 2. Commands

```bash
npm test
npm run test:e2e
```

Từ root monorepo:

```bash
npm run test:client
```

## 3. Browser E2E Hiện Có

### `tests/e2e/auth-flow.spec.ts` (`P1`)

Focus: customer login, protected create pages, logout, register và cookie verification.

Review khi đổi auth route handlers, cookie bridge, redirect behavior hoặc protected-route gating.

### `tests/e2e/listing-create.spec.ts` (`P1`)

Focus: tạo property với image upload, tạo rent request có budget, tạo negotiable rent request không budget.

Review khi đổi create forms, create server actions, revalidation, route changes hoặc success UX.

### `tests/e2e/user-dashboard-status.spec.ts` (`P1`)

Focus: rejected property/rent-request revision flow, transition về pending và hidden actions sau publish.

Review khi đổi user dashboard status UI hoặc listing moderation/revision flow.

### `tests/e2e/auth-page.spec.ts` (`P2`)

Focus: auth page shell render heading và action button.

Đây là smoke check cho route/shell availability, không phải business-critical flow.

## 4. Mock API E2E

Playwright dùng mock API server trong:

```text
tests/e2e/mock-api-server.cjs
tests/e2e/mock-api/
```

Mock route groups hiện có:

- auth
- banners
- categories
- content/static content
- FAQs
- leads
- listings
- locations
- media
- news
- search
- SEO contents
- system

Khi đổi request/response shape của browser journey, cập nhật mock router/fixtures cùng test.

## 5. Unit Tests

Unit tests hiện có:

- `tests/unit/auth-service.test.ts`
- `tests/unit/server-api-client.test.ts`
- `tests/unit/auth-cookies.test.ts`
- `tests/unit/validation.test.ts`
- `tests/unit/format.test.ts`
- `tests/unit/listing-filter.test.ts`
- `tests/unit/text-normalize.test.ts`
- `tests/unit/utils.test.ts`
- `tests/unit/google-map.test.ts`
- `tests/unit/listing-match-status.test.ts`

Các suite này bảo vệ service boundary, refresh/retry behavior, cookie options, schema branches, formatting/filtering, Google Map helper và listing-match status logic.

## 6. Component Và Hook Tests

Component tests hiện có:

- `tests/components/auth/LoginForm.test.tsx`
- `tests/components/auth/SignupForm.test.tsx`
- `tests/components/common/FavoriteButton.test.tsx`
- `tests/components/common/Pagination.test.tsx`
- `tests/components/common/PasswordInput.test.tsx`
- `tests/components/common/PosterContactCard.test.tsx`
- `tests/components/listing-filter/ListingFilterToolbar.test.tsx`
- `tests/components/listing-form/PropertyCreateForm.test.tsx`

Hook/lib tests:

- `tests/hooks/use-auth.test.tsx`
- `tests/lib/favorites/favorite-navigation.test.ts`

Các suite này bảo vệ render states, validation behavior, favorite UX, pagination, password visibility, contact card, filter toolbar, create form states và auth hook cache cleanup.

## 7. Quy Tắc Cập Nhật Test

- Auth/cookie/proxy/session flow: review `auth-flow.spec.ts`, `server-api-client.test.ts`, `auth-cookies.test.ts`.
- Listing create/update form behavior: review `listing-create.spec.ts` và component/schema tests liên quan.
- User dashboard moderation/status: review `user-dashboard-status.spec.ts`.
- Favorites: review `FavoriteButton.test.tsx` và `favorite-navigation.test.ts`.
- Listing match status helpers: review `listing-match-status.test.ts`.
- Pure helper/schema branches: thêm unit test, không thêm Playwright nếu không cần browser.
- Render-state/error-mapping form behavior: thêm component test trước.

## 8. Coverage Tracking

Ma trận coverage sống nằm ở `TEST_COVERAGE.md`.

Cập nhật file đó khi:

- thêm/xóa test suite
- đổi priority của flow
- thêm coverage cho feature area mới
- phát hiện coverage gap quan trọng trong lúc refactor

## 9. Drift Prevention

Khi route structure, auth flow, server action hoặc test boundary đổi:

- cập nhật tài liệu này
- cập nhật `ARCHITECTURE.md` nếu ownership/data flow đổi
- cập nhật `TEST_COVERAGE.md` nếu coverage matrix đổi
