# Architecture

## 1. Overview

This repository is a Next.js App Router frontend for a Vietnamese real-estate product.

The current code base is organized around:

- route groups for public, auth, and CMS flows
- a server-first data layer
- shared UI primitives and shared shells
- domain-oriented components instead of page-level monoliths

The frontend should stay readable when the product scales. That means keeping ownership clear across routes, services, actions, hooks, stores, and UI layers.

## 2. Current Stack

- Next.js `16.2.4`
- React `19`
- Tailwind CSS `4`
- shadcn-based primitive UI layer
- `react-hook-form` for forms
- `zod` for validation
- `zustand` for shared UI state
- `@tanstack/react-query` for client async state
- server actions for browser-triggered mutations and selective browser-triggered reads

Shared contract constants are split by responsibility:

- `src/constants/enum-values.ts` for enum/value contracts used by schemas and actions
- `src/constants/enum-options.ts` for UI labels and select options

Shared helper logic is grouped by domain inside `src/lib`:

- `src/lib/form/` for payload normalization, number input, and form-specific helpers
- `src/lib/text/` for slug-safe text normalization and humanization helpers
- `src/lib/listing/` for listing slug and form-default/gallery helpers
- `src/lib/listing/flat-url.ts` for canonical listing route parsing/building and breadcrumb inputs
- `src/lib/location/` for location filter and flat-url context helpers
- `src/lib/navigation/` for shared CMS navigation item builders
- `src/lib/filter/` for listing filter summary and range helpers
- `src/lib/format.ts` for shared date, number, currency, and location formatters
- `src/lib/pagination.ts` for pagination URL and page-change helpers
- `src/lib/server/` for reusable cache revalidation, auth, and server-side pagination helpers

## 3. Route Structure

```text
src/app/
  layout.tsx
  (main)/
    layout.tsx
    page.tsx
    cho-thue/
    can-thue/
    du-an/
    tin-tuc/
  (auth)/
    dang-nhap/
    dang-ky/
    dang-nhap-admin/
  (cms)/
    layout.tsx
    (admin)/
      layout.tsx
      admin/
    (user)/
      quan-li-tai-khoan/
  api/v1/
    auth/
    _utils/proxy.ts
```

## 4. Shell Ownership

### Root shell

`src/app/layout.tsx`

- loads global CSS
- loads `Be Vietnam Pro` through `next/font/google`
- provides global metadata
- wraps the app with `AppProviders`

### Public shell

`src/app/(main)/layout.tsx`

- owns `Header`, `Footer`, and `FloatingActions`
- sets the public-site baseline with `<main className="grow pt-16">`
- assumes a fixed header offset

### CMS root

`src/app/(cms)/layout.tsx`

- currently acts as a neutral pass-through layout
- exists to keep CMS route grouping explicit

### Admin CMS shell

`src/app/(cms)/(admin)/layout.tsx`

- resolves auth on the server
- redirects non-admin users away
- mounts the shared CMS shell with admin navigation
- scopes the subtree with `data-theme="admin"` so admin surfaces use the neutral admin palette

### Admin auth shell

`src/app/(auth)/dang-nhap-admin/page.tsx`

- uses the same admin theme scope as the admin CMS subtree
- keeps login-specific flow and redirect handling separate from public auth

### User CMS shell

User account pages live under:

- `src/app/(cms)/(user)/quan-li-tai-khoan`

They use the CMS grouping and user-specific layout composition rather than the public site shell.
- they must continue inheriting the public theme and must not opt into `data-theme="admin"`

## 5. SEO, Metadata, and Structured Data

Public SEO behavior is page-driven, but the implementation should stay layered.

### Metadata ownership

- `src/app/layout.tsx` owns the root metadata defaults, global Open Graph/Twitter defaults, and site-wide robots policy
- `src/app/(main)/layout.tsx` should stay focused on the public shell and should not try to render page-specific schema
- page-level `generateMetadata()` functions own record-aware metadata such as dynamic `title`, `description`, canonical URLs, and open graph images

### Schema.org placement

To keep JSON-LD maintainable:

- root layout should only own site-wide schema that does not depend on the current page record, such as `Organization` and `WebSite`
- `(main)` layout should remain a shell only; it is not the right place for detail-specific schema
- page components should own content-aware schema such as `BreadcrumbList`, `FAQPage`, `NewsArticle`, and detail-level `WebPage`
- helper components should render JSON-LD so pages pass data objects, not raw `<script>` tags

Recommended schema mapping:

- homepage: `WebSite` + `Organization`
- listing pages: `WebPage` or `CollectionPage` plus `BreadcrumbList`
- property detail pages: `WebPage` plus `BreadcrumbList`
- rent request detail pages: `WebPage` plus `BreadcrumbList`
- project detail pages: `WebPage` plus `BreadcrumbList`
- news detail pages: `WebPage` plus `NewsArticle` and `BreadcrumbList`
- FAQ-enabled pages: `FAQPage` in addition to the page-specific schema

### Shared SEO helpers

Shared helpers should be preferred for:

- JSON-LD serialization and escaping
- absolute URL normalization
- breadcrumb schema building
- FAQ schema building
- article/webpage schema building
- SEO description truncation and HTML stripping

This keeps schema logic close to the data source while avoiding repeated manual script blocks in every page.

### Public SEO content

`faqs` and `seo-contents` are public-page enrichment sources, not admin-only presentation details.

- `faqs` owns reusable question/answer content for public pages
- `seo-contents` owns HTML content rendered at the bottom of public pages
- the frontend should treat both as public SEO inputs and keep their rendering in sync with the route they enrich
- when these modules change, verify page-level FAQ rendering, SEO content blocks, and structured data together

### Sitemap contract

The frontend `app/sitemap.ts` fetches public API data directly to build sitemap entries.

Rules:

- keep public detail `slug` values stable so canonical URLs and sitemap URLs remain valid
- keep list endpoints paginated and filterable so sitemap generation can loop through all pages from the API
- keep useful timestamps on public payloads, especially `createdAt` and `updatedAt`, so sitemap `lastModified` can stay current
- keep relation data that helps the frontend build context, such as category, location, image URLs, and summary/content fields

## 5. Component Layers

```text
src/components/
  ui/
  common/
  auth/
  home/
  listing-client/
  listing-detail/
  listing-filter/
  cms/
    shared/
    admin/
    user/
  providers/
```

### `src/components/ui`

Lowest-level UI primitives.

Use this layer first for:

- button
- input
- table
- dropdown
- dialog
- sheet
- tabs
- select
- badge
- card

Do not introduce another primitive UI layer for the same job.

### `src/components/common`

Shared components reused across multiple domains and routes, such as:

- header/footer
- breadcrumb
- pagination
- cards
- CTA blocks
- media rendering
- common empty/error/presentation blocks

### Feature layers

- `home`: homepage sections
- `listing-filter`: filter UX and filter composition
- `listing-client`: client-side listing orchestration
- `listing-detail`: detail-page domain layouts
- `auth`: login/register UI
- `cms/shared`: shared CMS shell and navigation
- `cms/admin`: admin-specific tables and views
- `cms/user`: user-specific account/profile views

### File naming

- `src/app/**` route files stay in Next.js route naming, such as `page.tsx`, `layout.tsx`, and `not-found.tsx`
  - `src/components/ui/**` primitives keep the shadcn lowercase filename style
  - reusable React component files under `src/components/**` use `PascalCase` when the file exports a component
  - utility, helper, and non-component support files can stay `kebab-case`
  - keep the file name aligned with the file role rather than forcing one naming style across every layer

### Utility ownership

- Pure normalize/transform/map helpers that are reused across more than one feature should live in `src/lib`
- Keep `.ts` helper files inside `src/components/**` only when they are truly feature-local and unlikely to be reused elsewhere
- Type-only shared contract shapes should live in `src/types`
- If a helper starts appearing in multiple components, pages, or actions, move it out of the component tree before the duplication spreads
- Keep `src/helpers/` retired as a legacy layer; do not add new helpers there
- Current shared helper modules include:
  - `src/lib/form/form-normalize.ts` for FormData and payload normalization
  - `src/lib/form/form-payload.ts` for `FormData` append helpers
  - `src/lib/form/number-input.ts` for shared numeric parsing and formatting
  - `src/lib/listing/listing-form.ts` for listing form default and gallery transforms
  - `src/lib/listing/listing-slug.ts` for SEO slug building
  - `src/lib/listing/flat-url.ts` for canonical listing route parsing/building
  - `src/lib/location/location-filter.ts` for location filter and flat-url context helpers
  - `src/lib/navigation/cms-navigation.ts` for shared CMS navigation item builders
  - `src/lib/filter/filter-helpers.ts` for listing filter summary and range helpers
  - `src/lib/format.ts` for shared display formatters
  - `src/lib/pagination.ts` for pagination URL and page-change helpers
  - `src/lib/text/text-normalize.ts` for Vietnamese text normalization helpers
  - `src/lib/server/revalidate.ts` for reusable cache revalidation helpers
  - `src/lib/server/server-auth.ts` for server auth user resolution
  - `src/lib/server/server-side.ts` for server-side search param helpers

### CMS and listing forms

- CMS CRUD forms should reuse shared shells and field primitives wherever possible
- Property and rent request forms intentionally share the same base field blocks across public create, admin edit, and user edit variants
- The homepage hero renders banners from the API as a slider, so banner data should stay API-driven rather than hardcoded in the page

## 6. Data Layer

The repository now follows a server-first data model.

### Server reads

Expected flow:

- page or server component
- domain service in `src/services`
- backend API

Primary shared fetch layer:

- `src/services/shared/server-api-client.ts`

This layer is responsible for:

- backend URL construction
- auth-aware server fetch
- response normalization
- backend error normalization

### Browser mutations

Expected flow:

- client component or form
- server action in `src/actions`
- domain service
- backend API

Current server action layer includes:

- `user.actions.ts`
- `media.actions.ts`
- `location.actions.ts`
- `news.actions.ts`

### Route handlers

`src/app/api/v1/*` is no longer a generic data proxy layer.

It should remain minimal and focused on auth flows that truly need:

- cookie writes
- cookie clears
- refresh flow
- OAuth redirects and callbacks

Current route handler ownership:

- `auth/login`
- `auth/logout`
- `auth/refresh`
- `auth/register`
- `auth/google`
- `auth/google/callback`
- `_utils/proxy.ts` as helper for those auth routes

## 7. Service Ownership

Services in `src/services` are domain-oriented and server-facing.

Current service modules include:

- `auth.service.ts`
- `user.service.ts`
- `property.service.ts`
- `rent-request.service.ts`
- `project.service.ts`
- `news.service.ts`
- `category.service.ts`
- `banners.service.ts`
- `seo-content.service.ts`
- `faq.service.ts`
- `location.service.ts`
- `media.service.ts`

### Service rules

- one domain service per resource or resource family
- do not create extra "manager" or "aggregate" services unless there is real cross-domain value
- do not let client components import server-only services
- do not pass access tokens around manually if the service layer can resolve auth at the server boundary
- for list/query services, prefer a named `Params` type alias instead of inline object shapes, especially when the service accepts `page`, `limit`, `filters`, or search keys like `q`
- keep the params type close to the service so page-level code can rely on a stable contract when search or filter fields expand

## 8. Hooks and Stores

### Hooks

Hooks in `src/hooks` are client-side orchestration layers.

Typical responsibilities:

- react-query bindings
- UI-facing mutation wrappers
- client state transitions
- data refresh orchestration

They should not replace the domain service layer.

### Stores

Stores in `src/stores` use Zustand and should be reserved for shared UI state.

Rules:

- use Zustand for shared UI state only
- do not move server data into Zustand when React Query is more appropriate
- do not create a store for state that can stay local to a component

## 9. Validation and Forms

### Forms

The preferred form stack is:

- `react-hook-form`
- `zod`
- `@hookform/resolvers`

### Schema placement

Validation schemas live in `src/schemas`.

Rules:

- infer types from schemas when practical
- do not scatter validation across components if a schema is appropriate
- keep field-level and payload-level validation aligned

## 10. Listing and Routing Contract

`src/lib/flat-url.ts` is a critical source of truth for listing route behavior.

It is responsible for:

- slug parsing
- flat URL building
- breadcrumb inputs
- route synchronization rules
- shared range filter semantics for property and rent-request listing flows

Canonical listing routes use a 2-block flat slug:

- block 1: `category-location` combined into one segment
- block 2: `price-dt-pn-pt-direction` combined into one segment
- `dt` is the short form for area
- `pn` and `pt` are the short forms for bedrooms and bathrooms
- `5pn` and `5pt` mean `>= 5`

When changing listing routes, breadcrumb logic, or path generation:

- inspect `flat-url.ts` first
- do not reimplement slug behavior ad hoc inside pages or components

## 11. CMS Architecture

CMS uses a shared shell with role-specific ownership.

### Shared CMS

`src/components/cms/shared`

- shell composition
- navigation config
- layout container for CMS content structure
- desktop-collapsible sidebar state and rail behavior
- shared form-page shell for CMS screens that only render input forms

### Admin CMS

`src/components/cms/admin`

- admin listing tables
- admin placeholder/pilot panels
- admin sidebar wiring

### User CMS

`src/components/cms/user`

- profile editing
- password flow
- my-properties table
- my-rent-requests table

### CMS page width patterns

- table and dashboard screens remain full-width inside the CMS shell
- form-only screens use the shared CMS form shell so content does not stretch across the full available width

## 12. Refactor Rules

When refactoring:

- preserve route contract
- preserve data contract
- preserve filter semantics
- preserve breadcrumb semantics
- preserve ownership boundaries

Only then improve structure.

Do not use refactoring as a reason to:

- change auth flow
- change route meaning
- split one pattern into multiple competing patterns
- add new abstraction that does not reduce real duplication

## 13. Drift Prevention

Whenever architecture-affecting code changes:

- verify docs still match source
- update `ARCHITECTURE.md` if route structure, shell structure, or data flow changed
- update `DESIGN.md` if tokens, layout primitives, or component language changed
- update `AGENTS.md` only for repo-wide working rules

## 14. Minimum Verification

After meaningful architectural or typing changes:

- run `npx.cmd tsc --noEmit`

If UI was touched, also verify manually on desktop and mobile when feasible.

## 15. Testing Governance

This repository now treats test impact as part of feature completeness.

- every new FE feature should be reviewed for `unit`, `integration`, and `e2e` impact
- if a change touches render logic, form behavior, hooks, or pure helpers, update or add `Jest + RTL` coverage
- if a change touches route behavior, auth/session flow, redirect, cookies, or browser journeys, update or add `Playwright` coverage
- if a change touches request/response behavior, prefer `MSW`-driven component/integration tests over brittle end-to-end mocking
- do not merge a meaningful FE feature change without checking whether `TEST_COVERAGE.md` needs an update

Recommended test layout:

- `tests/unit/` for pure helpers and boundary logic
- `tests/components/` for component and integration tests
- `tests/hooks/` for hook behavior
- `tests/e2e/` for browser journeys

When a feature is intentionally not covered by a test layer, the PR or change set should say why.

## 16. Test Coverage Tracking

Keep the live test matrix in `TEST_COVERAGE.md`.

- update it when a feature area gains or loses test coverage
- keep the matrix aligned with the current routes, components, hooks, and helpers
- use it as the quick reference for what is safe to refactor and what still needs test work
