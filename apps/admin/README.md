# thuematbang.com.vn Admin

Admin CMS/operator app riêng cho thuematbang.com.vn.

## Stack

- Vite 8
- React 19
- TypeScript
- refine
- Ant Design 5
- React Router
- TanStack Query
- Axios
- React Hook Form, Zod cho các form cần schema validation
- `@thuematbang/contracts` cho shared domain contracts

## Vai Trò

App này phục vụ admin/operator workflows:

- dashboard
- tin cho thuê và tin cần thuê
- leads
- listing matches
- users
- news, projects, banners, FAQs
- static pages, SEO contents
- categories, locations
- payments và commerce orders

Public site, auth customer, đăng tin customer và user CMS nằm ở `../client`.

## Entry Points

```text
src/main.tsx
src/App.tsx
```

`src/App.tsx` compose:

- `BrowserRouter`
- Ant Design `ConfigProvider` với locale `vi_VN`
- TanStack `QueryClientProvider`
- `RefineKbarProvider`
- refine `Refine`
- `authProvider`
- `dataProvider`
- `accessControlProvider`
- `AdminLayout`

Root app dùng:

```tsx
<div className="admin-app-shell" data-theme="admin">
```

## Source Structure

```text
src/
  app-shell/      AdminLayout và shell navigation
  components/     shared admin components/fields/states
  features/       feature-local logic nếu cần
  lib/admin/      constants, hooks, utils cho admin
  pages/          route pages theo resource
  providers/
    auth/
    data/
    access-control/
    notification/
  resources/      refine resource registry và menu groups
  styles/         admin.css, Ant Design theme
  types/
```

## Auth Flow

Auth nằm trong `src/providers/auth`.

- `auth-provider.ts` implement refine `AuthProvider`.
- Login gọi backend `/auth/login` với `identifier` và `password`.
- Token lưu bằng `auth-store`.
- `auth-client.ts` tạo Axios instance theo `VITE_API_BASE_URL`.
- Request interceptor gắn bearer token.
- Response interceptor refresh access token khi gặp `401`, queue failed requests trong lúc refresh, và redirect `/login` nếu refresh thất bại.

Admin identity/permission được lấy từ `/users/me`. `accessControlProvider` hiện cho phép toàn bộ route sau khi authenticated; backend vẫn là lớp bảo vệ quyền cuối cùng.

## Data Provider

`src/providers/data/data-provider.ts` implement refine `DataProvider`.

Nhiệm vụ:

- map resource name sang backend endpoint
- normalize pagination envelope dạng `items/pagination`, `data/meta` hoặc array
- map filter `search` sang query `q`
- map sorter đầu tiên sang `sortBy` và `sortOrder`
- dispatch `admin-data-changed` sau create/update/delete để các widget khác có thể refresh

Endpoint map chính:

- `properties -> /properties`
- `rent-requests -> /rent-requests`
- `users -> /admin/users`
- `listing-matches -> /listing-matches`
- `static-pages -> /static-pages`
- `seo-contents -> /seo-contents`
- commerce orders: `/property-package-orders`, `/property-boost-orders`, `/rent-request-express-orders`

## Resources Và Routes

Resource registry nằm ở `src/resources/index.tsx`.

Menu groups hiện tại:

- `overview`: dashboard
- `for-rent`: properties, property leads
- `rent-request`: rent requests, rent-request leads
- `connections`: listing matches
- `content`: projects, news, SEO contents, FAQs, banners, static pages, categories, locations
- `monetization`: payments, package orders, boost orders, express orders
- `system`: users

Routes được khai báo rõ trong `src/App.tsx`. Khi thêm resource mới, phải cập nhật cả:

- `adminResources`
- `menuGroups`
- `ENDPOINT_MAP` trong data provider nếu endpoint không trùng resource name
- route import và `<Route>` trong `App.tsx`
- page files dưới `src/pages/<resource>/`

## Design Và Theme

Admin app dùng Ant Design theme trong `src/styles/theme.ts` và CSS trong `src/styles/admin.css`.

Ngôn ngữ UI:

- neutral blue admin palette
- dense nhưng dễ scan
- bảng, filter, form và action rõ ràng
- tiếng Việt-first labels/messages

Không copy Tailwind/shadcn surface system của client vào admin app. Admin dùng Ant Design primitives và theme token của Ant Design.

## Commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run preview
```

Từ root monorepo:

```bash
npm run dev:admin
npm run build:admin
npm run typecheck:admin
npm run lint:admin
```

## Environment

API base URL:

```text
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Nếu không cấu hình, app fallback về `http://localhost:8000/api/v1`.

## Quy Tắc Khi Thêm Admin Feature

- Thêm resource vào registry trước để menu/routing có source of truth.
- Giữ backend endpoint mapping trong `data-provider.ts`, không hardcode URL rải rác trong page.
- Dùng Ant Design form/table primitives trước khi tạo component mới.
- Dùng type/enum từ `@thuematbang/contracts` khi có.
- Không bypass `authProvider`/`axiosInstance` cho request cần auth.
- Sau khi đổi resource/page, chạy `npm run typecheck`.
