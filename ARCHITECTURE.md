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

### User CMS shell

User account pages live under:

- `src/app/(cms)/(user)/quan-li-tai-khoan`

They use the CMS grouping and user-specific layout composition rather than the public site shell.

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
