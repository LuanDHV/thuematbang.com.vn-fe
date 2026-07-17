# @thuematbang/contracts

Package TypeScript chia sẻ hợp đồng domain cho frontend monorepo.

## Vai Trò

Package này cung cấp:

- enums domain
- API/pagination/error types
- resource types
- constants dùng chung
- mapper/format helpers
- utility text normalization

Package không chứa React component, route handler, server action, service fetch hoặc code phụ thuộc app runtime.

## Exports

```ts
export * from "./enums/index.js";
export * from "./types/index.js";
export * from "./constants/index.js";
export * from "./mappers/index.js";
export * from "./utils/index.js";
```

Subpath exports:

- `@thuematbang/contracts/enums`
- `@thuematbang/contracts/types`
- `@thuematbang/contracts/constants`
- `@thuematbang/contracts/mappers`
- `@thuematbang/contracts/utils`

## Domain Types Hiện Có

Các nhóm type chính:

- auth, user
- property, rent request, project, news
- category, banner, FAQ, SEO content, static page
- location
- lead, favorite, listing match, public search
- commerce, payment/order state
- media, gallery, Cloudinary
- API envelope và API error

## Commands

```bash
npm run build
npm run typecheck
```

Root monorepo build client/admin đã chạy `build:contracts` trước.

## Quy Tắc Cập Nhật

- Đồng bộ với backend DTO/response trước khi đổi public type.
- Không tự thêm enum value nếu backend chưa hỗ trợ.
- Khi đổi exports, kiểm tra cả `apps/client` và `apps/admin`.
- Giữ package ESM và dùng `.js` extension trong source exports vì TypeScript emit ESM cần path rõ ràng.
