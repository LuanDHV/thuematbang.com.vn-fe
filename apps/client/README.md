# thuematbang.com.vn Client

Next.js App Router app cho public site, auth, đăng tin và user CMS.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- shadcn-based UI primitives
- `@fontsource/be-vietnam-pro`
- React Hook Form, Zod
- TanStack Query, Zustand
- Server actions, server components, route handlers
- Jest/RTL, MSW, Playwright

## Route Groups

```text
src/app/
  (main)/   public site, listing, news, projects, static pages, listing create
  (auth)/   đăng nhập, đăng ký
  (cms)/    user account CMS
  api/v1/   auth route handlers và backend proxy
```

Các public route chính:

- `/`
- `/cho-thue`, `/cho-thue/[...slug]`
- `/can-thue`, `/can-thue/[...slug]`
- `/du-an`, `/du-an/[...slug]`
- `/tin-tuc`, `/tin-tuc/[...slug]`
- `/dang-tin/cho-thue`, `/dang-tin/can-thue`
- `/gioi-thieu`, `/lien-he`, FAQ và các trang chính sách

User CMS nằm dưới `/quan-li-tai-khoan`.

## Data Flow

- Server reads: page/server component -> `src/services` -> backend API.
- Browser mutations: client component/form -> `src/actions` -> service -> backend API.
- Auth/cookie/proxy flow: `src/app/api/v1/*`.
- Catch-all proxy `src/app/api/v1/[...path]/route.ts` forward request đến backend và gắn token từ cookie.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run test:e2e
```

Khi chạy từ root monorepo, dùng:

```bash
npm run build:client
npm run typecheck:client
npm run test:client
```

## Tài Liệu Liên Quan

- `ARCHITECTURE.md`: kiến trúc app client
- `AGENTS.md`: quy tắc làm việc trong app client
- `DESIGN.md`: design system và token
- `docs/testing/frontend-testing.md`: chiến lược test
