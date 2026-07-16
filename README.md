# thuematbang.com.vn Frontend Monorepo

Monorepo frontend cho thuematbang.com.vn.

## Workspace

```text
apps/
  client/    Next.js App Router cho public site, auth, user CMS
  admin/     Vite + refine + Ant Design cho admin CMS riêng
packages/
  contracts/ Shared enums, types, constants, mappers, utils
```

Root `package.json` dùng npm workspaces. `@thuematbang/contracts` phải build trước các app khi chạy production build.

## Stack Theo App

### `apps/client`

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- shadcn-based primitives
- React Hook Form, Zod
- TanStack Query, Zustand
- Server actions và route handlers cho auth/cookie/proxy flow

### `apps/admin`

- Vite 8
- React 19
- refine
- Ant Design 5
- React Router
- TanStack Query
- Axios data/auth providers

### `packages/contracts`

- TypeScript ESM package
- shared domain enums/types/constants/mappers/utils
- peer dependency: `zod`

## Commands

```bash
npm install
npm run build:contracts
npm run dev:client
npm run dev:admin
```

Build toàn bộ:

```bash
npm run build
```

Typecheck toàn bộ:

```bash
npm run typecheck
```

## Quy Tắc Chung

- Không duplicate enum/type domain giữa app; ưu tiên `@thuematbang/contracts`.
- Client public/user flows nằm trong `apps/client`.
- Admin operator flows nằm trong `apps/admin`.
- Nếu backend response shape đổi, cập nhật contracts trước rồi cập nhật service/data provider.
- Khi thêm workspace behavior mới, cập nhật docs cấp app và docs cấp monorepo nếu ảnh hưởng ranh giới ownership.

## Tài Liệu Liên Quan

- `ARCHITECTURE.md`: kiến trúc frontend monorepo
- `apps/client/ARCHITECTURE.md`: kiến trúc Next.js client
- `apps/client/AGENTS.md`: quy tắc làm việc trong client app
- `apps/client/DESIGN.md`: design system client/user CMS
- `apps/admin/README.md`: kiến trúc và quy tắc admin app
- `packages/contracts/README.md`: shared contracts package
