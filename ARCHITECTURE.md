# Kiến Trúc Frontend Monorepo

## 1. Tổng Quan

Frontend monorepo tách rõ ba trách nhiệm:

- `apps/client`: trải nghiệm public, auth, đăng tin, user CMS và SEO-facing pages bằng Next.js.
- `apps/admin`: admin CMS/operator tool riêng bằng Vite, refine và Ant Design.
- `packages/contracts`: hợp đồng domain dùng chung giữa các app FE.

Root workspace chỉ điều phối dependency, script và build order. Không đặt business logic dùng trực tiếp cho runtime ở root.

## 2. Build Và Dependency Flow

`@thuematbang/contracts` là package nội bộ được link bằng `file:../../packages/contracts`.

Build production phải đi theo thứ tự:

```text
contracts -> client/admin
```

Root scripts đã encode thứ tự này:

- `build:client`
- `build:admin`
- `build`
- `typecheck`

Khi đổi shared enum/type/mapper trong contracts, chạy:

```bash
npm run build:contracts
npm run typecheck
```

## 3. Client App Ownership

`apps/client` sở hữu:

- public site routes: home, listings, projects, news, static pages, FAQ/contact/policies
- auth routes: đăng nhập, đăng ký
- user CMS routes: quản lí tài khoản, tin cho thuê/cần thuê, favorites
- listing creation routes
- SEO metadata, sitemap, structured data
- server-first data access through `src/services`
- browser-triggered mutations through `src/actions`
- Next route handlers under `src/app/api/v1`

Client app không phải admin operator surface. Admin workflow lớn nên nằm ở `apps/admin`.

## 4. Admin App Ownership

`apps/admin` sở hữu admin CMS riêng:

- dashboard
- properties/rent requests moderation và CRUD
- leads, listing matches
- users
- news, projects, banners, FAQs, static pages, SEO contents, categories, locations
- payments và commerce orders

Admin app gọi backend trực tiếp qua `VITE_API_BASE_URL` bằng Axios/refine data provider. Token lưu ở client-side auth store và refresh qua interceptor.

## 5. Contracts Package Ownership

`packages/contracts` sở hữu:

- enums domain
- API/pagination/error types
- resource types cho property, rent request, project, news, user, favorite, listing match, static page, commerce
- constants như enum values và upload constants
- mapper/format helper có thể dùng chung
- utility text normalization

Không đặt React component, route logic, server action hoặc app-specific fetch trong contracts.

## 6. Quy Tắc Đồng Bộ Với Backend

- Backend Prisma schema và DTO/API response là nguồn sự thật domain phía server.
- Contracts là lớp chia sẻ type/value phía frontend, không tự ý mở rộng domain nếu backend chưa hỗ trợ.
- Client services và admin data provider phải cùng hiểu pagination/response envelope.
- Khi backend thêm module public/admin mới, cập nhật theo thứ tự: contracts nếu cần, client/admin service/provider, docs app liên quan.

## 7. Test Và Verification

Client:

```bash
npm run test:client
npm run typecheck:client
```

Admin:

```bash
npm run typecheck:admin
npm run lint:admin
```

Contracts:

```bash
npm run typecheck:contracts
npm run build:contracts
```

Docs-only changes không cần full test suite, nhưng nên chạy `git diff --check` để bắt lỗi whitespace.
