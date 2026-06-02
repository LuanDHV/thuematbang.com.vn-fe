# Frontend

## 1. Mục tiêu của hệ FE

- Repo này là một Next.js App Router frontend cho sản phẩm bất động sản.
- Cách tổ chức hiện tại ưu tiên route group, layout shell, feature component và service layer rõ ràng.
- Logic dữ liệu không nên nằm trong presentational component nếu đã có hook, service hoặc helper phù hợp.

## 2. Cấu trúc thư mục thực tế

```text
src/
  app/
    (cms)/
      (admin)
      (user)
    (main)/
    (auth)/
    api/v1/
  components/
    common/
    ui/
    home/
    listing-client/
    listing-detail/
    listing-filter/
    auth/
    cms/
      shared/
      admin/
      user/
    providers/
  hooks/
  services/
  stores/
  lib/
  helpers/
  constants/
  schemas/
  types/
```

### Vai trò từng lớp

- `src/app`: route entry, layout, metadata, API routes.
- `src/components/ui`: primitive UI kiểu shadcn, là lớp thấp nhất cho button, input, dialog, sheet, popover, select, tabs, card, v.v.
- `src/components/common`: component chia sẻ giữa nhiều domain, ví dụ header, footer, breadcrumb, card, pagination, CTA, empty/error state.
- `src/components/listing-filter`: toàn bộ stack filter của listing.
- `src/components/listing-client`: phần client orchestration cho list result.
- `src/components/listing-detail`: detail layout theo domain.
- `src/components/home`: các section của home page.
- `src/components/auth`, `src/components/cms/user`: UI theo luồng đăng nhập và quản lý hồ sơ người dùng.
- `src/components/cms/shared`: shell và navigation dùng chung cho CMS.
- `src/components/cms/admin`: UI và scaffold riêng cho CMS admin.
- `src/services`: lớp gọi API / domain service.
- `src/hooks`: wrapper React Query hoặc hook nghiệp vụ.
- `src/stores`: trạng thái UI dùng Zustand.
- `src/lib`: helper hạ tầng như `flat-url`, metadata, env, http, cloudinary.
- `src/helpers`: helper tính toán / format / resolve filter.
- `src/constants`: option list và data tĩnh.
- `src/schemas`: schema validate form.
- `src/types`: kiểu dữ liệu domain và API.

## 3. App Router và layout shell

### Root layout

- `src/app/layout.tsx` import `globals.css`, nạp font và bọc `AppProviders`.
- Root layout chịu trách nhiệm metadata cấp site, `html lang="vi"`, và nền gốc của app.

### Main layout

- `src/app/(main)/layout.tsx` là shell chính cho public site.
- Shell này ghép `Header`, `Footer`, `FloatingActions` và đặt `<main className="grow pt-16">`.
- Vì header fixed, các page public cần tính offset top tương ứng để không bị che nội dung.

### Auth pages

- `src/app/(auth)` hiện là các page độc lập.
- Không thấy một `layout.tsx` riêng cho auth group trong hiện trạng này, nên mỗi màn hình auth tự dựng khung full-screen của nó.

### API routes

- `src/app/api/v1` là lớp route handler để proxy sang backend.
- Cấu trúc route theo domain khá rõ: `auth`, `properties`, `projects`, `news`, `rent-requests`, `categories`, `locations`, `media`, `banners`, `faqs`, `seo-contents`, `users/me`.
- Ý nghĩa của lớp này là giữ frontend gọi API nội bộ nhất quán, thay vì rải trực tiếp URL backend khắp component.

## 4. Quy ước tổ chức logic

- Logic dữ liệu đi qua `services`.
- Hook nghiệp vụ hoặc React Query wrapper đi qua `hooks`.
- Trạng thái UI cục bộ / shared UI state đi qua `stores`.
- Format, parse, slug, breadcrumb, helper tính toán đi qua `lib` hoặc `helpers`.
- Option list và mock tĩnh đi qua `constants`.
- Validation form đi qua `schemas`.
- Kiểu dữ liệu đặt ở `types`, không nên khai báo lại trong component nếu đã có type domain.

### Quy tắc tách lớp

- Presentational component chỉ nên nhận props và render.
- Container hoặc hook mới giữ fetch, filter, state machine, mutate, router sync.
- Nếu một component cần biết quá nhiều về API hoặc query param, đó là dấu hiệu tách lớp chưa đủ.

## 5. Listing architecture

### Luồng hiện tại

- Entry listing thường đi qua `ListingFilterSection`.
- `ListingFilterSection` gắn `ListingFilterToolbar` ở trạng thái sticky và `ListingResultsClient` ở dưới.
- `ListingFilterToolbar` giữ state filter, gọi location data, parse keyword, và sync path.
- `ListingFilterPanels`, `ListingFilterDrawer`, `ListingFilterChipPopover` chia phần UX của filter theo khung desktop/mobile.

### Điểm cần giữ khi sửa listing

- Không đổi semantics filter chỉ vì muốn gọn code.
- Nếu đổi markup để phục vụ layout, output và interaction phải giữ nguyên.
- Các summary như khu vực, mức giá, diện tích phải vẫn phản ánh trạng thái filter thật.
- Breadcrumb nên được tạo từ helper dùng chung rồi truyền xuống, không nên dựng inline riêng ở từng page nếu có thể tránh.

## 6. Shared component layer

### `src/components/common`

- `Header`, `Footer`, `DynamicBreadcrumb`, `Pagination`, `Title`, `SeeMoreButton`, `DataErrorCard`, `PageFaq`, `PageSeoContent`, `CloudinaryImage`, `PropertyCard`, `ProjectCard`, `NewsCard`, `RentRequestCard`, `FeaturedNewsCard`, `PosterContactCard`, `PropertyImageGallery`, `CategoryChips`, `FloatingActions`.
- Đây là lớp giao diện dùng lại giữa nhiều route, nhiều domain.
- Những component này thường đã có style language riêng, nên chỉnh một nơi có thể tác động nhiều màn hình.

### `src/components/ui`

- Đây là primitive layer.
- Nếu control cơ bản như button, input, select, card, dialog, sheet, popover, tabs thay đổi, toàn site sẽ đổi theo.
- Khi cần đổi giao diện hệ thống, nên bắt đầu ở đây trước rồi mới lan sang component feature.

## 7. Feature domains

### Home

- `src/components/home` chia theo section: hero, featured, news, introduce, project.
- Các section này là tổ hợp presentation, không nên ôm logic phức tạp nếu đã có service hoặc data hook.

### Listing detail

- `src/components/listing-detail/<domain>` tách theo property, project, news, rent-request.
- Mỗi domain có content sidebar riêng và layout detail hai cột riêng.

### Auth

- `src/components/auth` là form và panel cho login / signup.
- UI auth vẫn dùng cùng design language của site, chỉ khác khung tập trung và mật độ layout.

### User

- `src/components/cms/user` giữ shell cho chỉnh sửa hồ sơ và đổi mật khẩu.
- Đây là nhóm có trạng thái riêng, nhưng vẫn nên bám theme chung của app.

## 8. Flat URL và routing contract

- `src/lib/flat-url.ts` là entrypoint quan trọng cho slug / flat URL.
- Nó liên quan trực tiếp đến listing route, breadcrumb, parse/build path và sync với backend contract.
- Nếu cần breadcrumb hoặc path generator cho listing, ưu tiên dùng helper này thay vì tự dựng array riêng ở page.
- Các route như `cho-thue`, `can-thue`, `du-an`, `tin-tuc` có ngữ nghĩa khác nhau nên không nên coi tất cả chỉ là một kiểu slug.

## 9. Route structure nên đọc theo lớp

### Public routes

- `src/app/(main)/page.tsx` là home.
- `src/app/(main)/cho-thue`, `can-thue`, `du-an`, `tin-tuc` là các nhóm listing / category / detail route.

### User routes

- `src/app/(cms)/(user)/quan-li-tai-khoan` và các subpage nằm chung CMS shell nhưng có layout con riêng.

### API routes

- `src/app/api/v1/...` là hợp đồng dữ liệu của FE với backend.
- Frontend structure tốt là khi route handler, service và hook cùng đọc được cùng một domain name.

## 10. Quy tắc refactor

- Bắt đầu từ `globals.css` và root layout nếu là thay đổi hệ thống giao diện.
- Sau đó mới tới primitive UI.
- Tiếp theo là `Header`, `Footer`, breadcrumb, title block.
- Sau đó mới migrate listing filter, card, list result, detail page.
- Không xé logic ra khỏi container/hook chỉ để làm component trông “sạch” hơn nếu đổi đó gây đứt luồng state.

### Ưu tiên khi chỉnh frontend

1. Giữ contract dữ liệu và route ổn định.
2. Giữ semantics filter, breadcrumb, heading, CTA, list result.
3. Chuẩn hóa token và primitive trước khi patch local.
4. Chỉ override cục bộ khi thật sự có lý do.

## 11. QA và drift prevention

- Sau batch sửa lớn, kiểm tra desktop và mobile.
- Kiểm tra interaction ở filter, popover, dialog, drawer, form và tab.
- Chạy `npx.cmd tsc --noEmit` để bắt drift kiểu và import.
- Soát lại text tiếng Việt vì repo này rất nhạy với label, summary và copy UI.
- Nếu thấy class lặp lại nhiều nơi như `px-4 py-*`, `bg-white`, `shadow-sm`, `border-gray-200`, nên cân nhắc nâng cấp thành token hoặc primitive thay vì tiếp tục copy.

## 12. Kết luận thực dụng

- FE hiện tại đã có khung structure tốt: App Router + route groups + shared shell + feature components + service layer.
- Điểm mạnh của repo là token hóa màu, spacing và surface đã khá rõ.
- Điểm còn cần giữ chặt là không để logic route/filter/breadcrumb bị phân tán lại vào từng page.
