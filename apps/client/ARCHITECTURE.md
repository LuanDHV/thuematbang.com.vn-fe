# Kiến Trúc Client App

## 1. Tổng Quan

`apps/client` là Next.js App Router app cho public site, auth, đăng tin và user CMS của thuematbang.com.vn.

Kiến trúc hiện tại ưu tiên:

- route groups rõ ràng cho public, auth, CMS và API route handlers
- server-first reads qua domain services
- browser mutations qua server actions
- shared UI primitives và shared shells
- component theo domain, tránh page-level monolith
- SEO metadata/structured data đặt gần page data source

## 2. Stack Hiện Tại

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn-based primitives trong `src/components/ui`
- `@fontsource/be-vietnam-pro`
- React Hook Form, Zod
- TanStack Query
- Zustand
- Axios ở service/admin-adjacent boundary khi cần
- Jest, React Testing Library, MSW, Playwright

Shared contracts đến từ `@thuematbang/contracts` và local constants:

- `src/constants/enum-values.ts`: enum/value contracts dùng cho schema/action
- `src/constants/enum-options.ts`: label/options cho UI

## 3. Route Structure

```text
src/app/
  layout.tsx
  sitemap.ts
  (main)/
    layout.tsx
    page.tsx
    cho-thue/
    can-thue/
    du-an/
    tin-tuc/
    dang-tin/
    gioi-thieu/
    lien-he/
    cau-hoi-thuong-gap/
    <static-policy-pages>/
  (auth)/
    dang-nhap/
    dang-ky/
  (cms)/
    layout.tsx
    (user)/
      quan-li-tai-khoan/
  api/v1/
    auth/
    [...path]/
    _utils/proxy.ts
```

Public route families:

- `/`
- `/cho-thue`, `/cho-thue/[...slug]`
- `/can-thue`, `/can-thue/[...slug]`
- `/du-an`, `/du-an/[...slug]`
- `/tin-tuc`, `/tin-tuc/[...slug]`
- `/dang-tin/cho-thue`, `/dang-tin/can-thue`
- static pages: giới thiệu, liên hệ, FAQ, quy chế, quy định đăng tin, điều khoản, bảo mật, giải quyết khiếu nại

User CMS:

- `/quan-li-tai-khoan`
- `/quan-li-tai-khoan/cho-thue`
- `/quan-li-tai-khoan/can-thue`
- `/quan-li-tai-khoan/da-quan-tam/[[...filters]]`
- profile/password edit routes

Admin operator UI không nằm trong app này; app admin riêng ở `../admin`.

## 4. Shell Ownership

### Root shell

`src/app/layout.tsx`:

- import font từ `@fontsource/be-vietnam-pro`
- import global CSS và lightbox CSS
- định nghĩa root metadata, robots policy, Open Graph/Twitter defaults
- bật Google Tag Manager khi production hoặc env local cho phép
- render site-wide `WebSite` và `Organization` JSON-LD
- wrap app bằng `AppProviders`

### Public shell

`src/app/(main)/layout.tsx`:

- sở hữu `Header`, `Footer`, `FloatingActions`
- public content baseline có fixed header offset
- dùng public visual language và `layout-container`

### CMS shell

`src/app/(cms)/layout.tsx` giữ route grouping CMS. User CMS dùng components dưới `src/components/cms/user` và không dùng admin operator shell của `apps/admin`.

User CMS có theme scope riêng `data-theme="user-cms"` khi layout/component áp dụng. Không dùng `data-theme="admin"` cho user account pages.

## 5. SEO, Metadata Và Sitemap

SEO là page-driven:

- root layout giữ metadata mặc định và site-wide structured data
- page-level `generateMetadata()` giữ title, description, canonical, OG image theo record
- page/detail components giữ schema data-aware như breadcrumb, article, FAQ, webpage
- helper component render JSON-LD thay vì script thủ công lặp lại

`src/app/sitemap.ts` fetch public API qua services để tạo sitemap entries cho:

- static public routes
- news/project categories
- news/project/property/rent-request detail pages

Sitemap cần public payload có `slug`, `createdAt`/`updatedAt` và relation/image context đủ dùng.

## 6. Component Layers

```text
src/components/
  ui/
  common/
  auth/
  home/
  listing-client/
  listing-detail/
  listing-filter/
  listing-form/
  cms/
    shared/
    user/
  providers/
```

Layer rules:

- `ui`: primitive shadcn-based components, dùng trước khi tạo primitive mới
- `common`: header/footer, breadcrumb, pagination, media, cards, empty/error blocks, favorite button
- `listing-filter`: filter UX và filter composition
- `listing-client`: client-side listing orchestration
- `listing-detail`: detail layouts
- `listing-form`: create/edit/view form blocks
- `cms/shared`: shared account/CMS shell helpers
- `cms/user`: user account, my listings, favorites, profile/password

File naming:

- route files dùng convention Next.js: `page.tsx`, `layout.tsx`, `not-found.tsx`
- `src/components/ui/**` giữ lowercase style của shadcn
- reusable component file dùng `PascalCase`
- helper/util file dùng `kebab-case`

## 7. Data Layer

### Server reads

Flow:

```text
page/server component -> src/services -> backend API
```

Shared fetch boundary:

- `src/services/shared/server-api-client.ts`

Nó chịu trách nhiệm build backend URL, auth-aware server fetch, response normalization và backend error normalization.

Service modules hiện có gồm auth, user, property, rent request, project, news, category, banners, FAQ, SEO content, static page, location, media, lead, favorite, listing match, public search.

### Browser mutations

Flow:

```text
client component/form -> src/actions -> service -> backend API
```

Action modules hiện có gồm user, media, location, news, lead, listing create, property, rent request, listing match, public search.

### Route handlers

`src/app/api/v1/*` có hai vai trò:

- auth/cookie/callback routes: login, logout, refresh, register, Google OAuth
- catch-all backend proxy: `src/app/api/v1/[...path]/route.ts`

Catch-all proxy forward method/query/body đến backend private API, gắn `Authorization` từ `accessToken` cookie và `X-Refresh-Token` từ `refreshToken` cookie. Không dùng proxy này như nơi chứa business logic.

## 8. Hooks, Stores Và Validation

Hooks trong `src/hooks` là client orchestration:

- React Query bindings
- mutation wrapper
- UI refresh/state transition

Stores trong `src/stores` dùng Zustand cho shared UI state. Không đưa server data vào Zustand khi React Query/service layer phù hợp hơn.

Forms dùng:

- React Hook Form
- Zod
- `@hookform/resolvers`

Validation schemas nằm trong `src/schemas`. Ưu tiên infer type từ schema khi hợp lí.

## 9. Listing Và Routing Contract

Flat URL logic là contract quan trọng trong:

- `src/lib/listing/flat-url.ts`

Canonical listing route dùng 2 block:

- block 1: `category-location`
- block 2: `price-dt-pn-pt-direction`

Quy ước:

- `dt`: diện tích
- `pn`: phòng ngủ
- `pt`: phòng tắm
- `5pn`/`5pt`: lớn hơn hoặc bằng 5

Khi đổi listing route, breadcrumb, filter summary hoặc path generation, kiểm tra file này trước và không reimplement logic ad hoc trong page/component.

## 10. Shared Helpers

Helper dùng chung nằm trong `src/lib`:

- `form/`: normalize payload, number input, FormData helpers
- `text/`: Vietnamese text normalization/humanization
- `listing/`: form default, gallery transform, slug, flat URL
- `location/`: location filter/context helpers
- `navigation/`: CMS/user navigation builders
- `filter/`: listing filter summary/range helpers
- `server/`: revalidation, server auth, server-side search param helpers
- `seo/`, `site-config`, `format`, `pagination`

Không thêm helper mới vào `src/helpers/`; layer đó được xem là legacy.

## 11. Testing Governance

Testing guide nằm ở `docs/testing/frontend-testing.md`.

Live coverage matrix nằm ở `TEST_COVERAGE.md`.

Quy tắc:

- render logic, schema, helper, hook: unit/component test
- auth/cookie/protected route/browser journey: Playwright
- request/response integration: ưu tiên MSW-driven tests trước khi thêm e2e đắt đỏ
- khi đổi route behavior, auth/session, listing creation hoặc dashboard/user CMS status flow, review e2e tương ứng

## 12. Drift Prevention

Khi đổi architecture-affecting code:

- cập nhật file này nếu route structure, shell, data flow hoặc ownership đổi
- cập nhật `DESIGN.md` nếu token/theme/component language đổi
- cập nhật `AGENTS.md` nếu working rule đổi
- cập nhật `docs/testing/frontend-testing.md` và `TEST_COVERAGE.md` nếu test strategy/coverage đổi

## 13. Verification Tối Thiểu

Sau thay đổi typing/architecture:

```bash
npx.cmd tsc --noEmit
```

Sau thay đổi UI:

- kiểm tra desktop/mobile
- hover/focus/disabled
- Vietnamese copy rendering
- form validation/submit states nếu có form
