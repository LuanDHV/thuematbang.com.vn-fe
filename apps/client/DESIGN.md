# Design System Client

## 1. Hướng Thiết Kế

Client app là Vietnamese-first real-estate experience:

- light-first
- warm-neutral
- sạch, rõ, đáng tin
- premium nhưng tiết chế
- ưu tiên đọc nội dung và so sánh listing hơn trang trí

Không đưa dark-heavy dashboard aesthetic vào public site. Admin operator aesthetic thuộc `apps/admin`; user CMS trong client có theme riêng nhưng vẫn gần public language.

## 2. Source Of Truth

- tokens và global utility classes: `src/app/globals.css`
- font import: `src/app/layout.tsx`
- primitive UI: `src/components/ui`
- public shell: `src/components/common`
- user CMS shell/components: `src/components/cms/user`
- shared CMS helpers: `src/components/cms/shared`

Font chính là `Be Vietnam Pro`, được import bằng `@fontsource/be-vietnam-pro`.

## 3. Theme Scopes

`globals.css` có ba scope quan trọng:

- `:root`: public site default
- `[data-theme="admin"]`: admin-like neutral palette nếu một surface cần admin scope
- `[data-theme="user-cms"]`: user account/CMS palette, vẫn warm/public-aligned

Trong `apps/client`, user account pages không được tự ý dùng admin operator language. Admin app riêng ở `../admin` dùng Ant Design theme riêng.

## 4. Semantic Tokens Chính

Public root tokens:

| Token | Vai trò |
| --- | --- |
| `--primary` | CTA, active state, accent |
| `--accent-soft` | soft highlight, pill, hover wash |
| `--app` | page background |
| `--surface` | card/panel base |
| `--surface-alt` | neutral elevated/media control surface |
| `--subtle` | soft section background |
| `--heading`, `--body`, `--secondary`, `--muted` | text hierarchy |
| `--hairline`, `--hairline-strong` | border nhẹ |
| `--border-subtle`, `--border-strong` | card/panel border |
| `--success`, `--warning`, `--info`, `--danger` | state tones |
| `--success-soft`, `--warning-soft`, `--info-soft`, `--danger-soft` | soft state backgrounds |

Tailwind aliases được khai báo trong `@theme`, ví dụ `text-heading`, `bg-app`, `border-border-subtle`, `text-danger`.

## 5. Surface System

Shared surface classes trong `globals.css`:

- `surface-card`: card/listing/stat block
- `surface-panel`: grouped content, forms, tables, settings panels
- `surface-float`: popover, dropdown-like surface, sticky/floating controls
- `surface-marketplace`: marketplace/listing card language
- `surface-editorial`: editorial/news/project content card
- `surface-utility`: translucent utility/control surface

Quy tắc:

- dùng surface class hiện có trước khi tạo local recipe
- nếu một style xuất hiện ở nhiều nơi, promote thành token/variant/component
- ưu tiên border/shadow mềm, tránh heavy border và shadow gắt

## 6. Layout Primitives

Global layout classes:

- `layout-container`: width 100%, max `80rem`, responsive inline padding
- `layout-section-sm`
- `layout-section`
- `layout-section-lg`

Public content nên dùng `layout-container`. User CMS shell không nên bị ép vào public listing layout nếu shell đã có padding/width rule riêng.

## 7. Typography

Nguyên tắc:

- tiếng Việt dễ đọc là ưu tiên đầu tiên
- heading dùng weight mạnh hơn, rhythm chặt hơn
- body copy thoáng hơn
- không thêm font thứ hai cho một feature

Text token thường dùng:

- heading: `text-heading`
- body: `text-body`
- secondary/meta: `text-secondary`
- muted/supporting: `text-muted`

Không scale font bằng viewport width cho UI controls. Text trong button/card phải fit trên mobile.

## 8. Public Shell Language

Public shell:

- fixed light translucent header
- warm app background
- footer có palette tối riêng
- content section có spacing rộng và cấu trúc rõ
- listing card, breadcrumb, filter, CTA và editorial block dùng shared components

Hero/banner data là API-driven khi có domain data, không hardcode layout copy tùy tiện.

## 9. User CMS Language

User CMS nằm trong `apps/client`, không phải `apps/admin`.

Quy tắc:

- giữ feeling gần public site nhưng dày thông tin hơn
- dùng `data-theme="user-cms"` khi cần scope token
- dùng panel/card rõ ràng cho form/table
- giữ action states dễ scan: pending, published, rejected, archived
- favorites/listing tables không được expose internal FE API route nếu có public/domain route phù hợp

## 10. Forms

Stack form:

- React Hook Form
- Zod
- shadcn-based inputs/controls

Quy tắc UI:

- validation message ngắn, rõ
- submit/loading/disabled states phải đọc được
- form-only screens nên dùng content width có chủ đích, thường `max-w-2xl`
- dùng `surface-panel` làm surface mặc định cho form group lớn
- không scatter validation logic trong component nếu schema phù hợp hơn

## 11. Tables Và Lists

User CMS tables dùng:

- panel wrapper
- stable pagination
- action controls rõ ràng
- status/priority badges dùng shared badge language

Listing/public lists:

- filter summary không làm đổi route semantics ngoài flat URL contract
- empty/error states nên dùng common components
- favorite interactions phải giữ auth/optimistic state dễ hiểu

## 12. Motion, Media Và Interaction

- hover lift/shadow nhẹ là đủ
- tránh scale/bounce quá mạnh ở content-heavy views
- focus-visible phải rõ trên light surfaces
- disabled state giảm nhấn nhưng vẫn đọc được
- image hover/overlay chỉ dùng khi tăng legibility hoặc affordance
- loading state nên phản ánh shape layout thật

## 13. Copy Và Localization

UI là tiếng Việt-first.

Quy tắc:

- bảo vệ encoding
- label ngắn, nhất quán giữa route, nav, heading, table/action
- tránh trộn thuật ngữ cho cùng domain, ví dụ “tin cho thuê” và “tin cần thuê”

## 14. Design Drift Prevention

Trước khi thêm visual code:

- đã có token chưa?
- đã có surface class chưa?
- đã có shared primitive/component chưa?
- đây là public shell, user CMS hay admin operator concern?

Nếu pattern lặp lại ở hai nơi, dừng copy và tạo token/variant/component phù hợp.

## 15. Verification Tối Thiểu

Sau UI change:

- desktop layout
- mobile layout
- spacing rhythm
- text hierarchy
- hover/focus/disabled states
- Vietnamese copy rendering
- form error/success states nếu có form
