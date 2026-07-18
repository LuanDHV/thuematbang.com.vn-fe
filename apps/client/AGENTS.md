<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from common examples. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Quy Tắc Làm Việc Trong Client App

Trước khi đổi code trong `apps/client`, đọc theo thứ tự:

1. `AGENTS.md`
2. `ARCHITECTURE.md`
3. `DESIGN.md`

Nếu source code và docs lệch nhau:

- xác minh bằng source code
- ghi nhận drift
- cập nhật đúng doc khi task chạm vùng đó

## Mục Tiêu Chính

Không chỉ tối ưu cho “feature chạy được”. Tối ưu cho codebase dễ mở rộng:

- không thêm layer trung gian không cần thiết
- không duplicate logic
- không duplicate UI pattern
- không tạo pattern thứ hai cho cùng một vấn đề
- không để docs lệch source
- không để component ôm quá nhiều trách nhiệm
- không sửa cục bộ theo cách làm yếu architecture chung

## Quy Tắc Bắt Buộc

- Giữ text files ở UTF-8 và LF.
- Bảo vệ tiếng Việt khỏi mojibake/encoding drift.
- Ưu tiên pattern hiện có trước khi tạo pattern mới.
- Ưu tiên naming rõ ràng hơn comment dài.
- Chỉ thêm comment ngắn khi logic không hiển nhiên, có assumption quan trọng hoặc workaround không tầm thường.
- Với helper/parser/filter dài, thêm comment ngắn quanh block logic khó để file dễ scan.
- Dùng đúng syntax comment của ngôn ngữ hiện tại; không dùng `#` trong TS/TSX/CSS.

## Architecture Rules

- Public pages, auth pages và user CMS là các shell khác nhau. Không trộn layout primitive tùy tiện.
- Admin operator app nằm ở `../admin`; không thêm admin CMS lớn vào `apps/client`.
- Server reads đi theo:

```text
page/server component -> service -> backend
```

- Browser mutations đi theo:

```text
client component/form -> server action -> service -> backend
```

- `src/app/api/v1/auth/*` dành cho cookie/refresh/OAuth flow.
- `src/app/api/v1/[...path]/route.ts` là backend proxy có token forwarding, không chứa business logic.
- Không tạo thêm generic proxy route handlers cạnh tranh với catch-all proxy hiện tại.

## Stack Consistency Rules

Nếu repo đã có tool chuẩn cho một nhóm vấn đề, dùng tool đó:

- forms: React Hook Form
- validation: Zod
- UI primitives: `src/components/ui`
- shared UI state: Zustand
- client async state/cache: TanStack Query
- server-side data access: `src/services`
- browser mutation bridge: `src/actions`
- shared domain contracts: `@thuematbang/contracts`

Không đưa server-only service vào client component. Không pass token thủ công nếu service/action boundary đã xử lý auth.

## UI Rules

- Dùng token và primitive từ `DESIGN.md` và `src/app/globals.css`.
- Reuse `surface-card`, `surface-panel`, `surface-float`, `surface-marketplace`, `surface-editorial`, `surface-utility` trước khi tạo local style.
- Không hard-code màu mới khi semantic token đã có.
- Không tạo visual language riêng cho một screen.
- User CMS dùng public/user CMS language, không dùng admin operator palette.

## Refactor Rules

Khi refactor, giữ nguyên:

- route contract
- data contract
- UI semantics
- filter semantics
- breadcrumb semantics
- heading/CTA/summary behavior

Chỉ cải thiện structure sau khi behavior an toàn. Không dùng “clean code” để biện minh cho semantic change.

## Validation Rules

Sau batch thay đổi có ý nghĩa, tối thiểu chạy:

```bash
npx.cmd tsc --noEmit
```

Nếu task có UI, kiểm tra thêm:

- desktop
- mobile
- hover/focus/disabled states
- Vietnamese labels/messages
- form validation và submit state nếu có form

Nếu không chạy manual UI check, nói rõ trong summary.

## Testing Docs

Khi đổi test strategy, suite boundary hoặc coverage expectation:

- cập nhật `docs/testing/frontend-testing.md`

`frontend-testing.md` là policy guide cho test strategy và suite boundary.
