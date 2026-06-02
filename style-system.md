# Style System

## 1. Mục tiêu thị giác
- Giao diện của repo này đi theo hướng sáng, ấm, cao cấp và dễ tin cậy.
- Accent cam là điểm nhấn chính, không phải nền chủ đạo cho toàn bộ màn hình.
- Không mặc định dark mode cho các màn hình nhiều text, filter, listing và detail.
- Ưu tiên cảm giác thoáng, sạch, có nhịp, ít border thô và ít khối màu nặng.

## 2. Nguồn token thật trong code
- Nguồn gốc của hệ token nằm ở `src/app/globals.css`.
- `@theme` đang map các CSS variable sang utility Tailwind theo tên semantic như `bg-app`, `text-heading`, `border-hairline`.
- Root layout nạp font ở `src/app/layout.tsx`; font thực tế đang dùng là `Be_Vietnam_Pro`, dù biến CSS vẫn giữ tên `--font-geist-sans` vì lịch sử triển khai.
- `body` dùng `bg-app text-body min-h-screen`, nên toàn site mặc định bám vào nền sáng ấm và text tối trung tính.

## 3. Color tokens
| Token | Giá trị thực tế | Vai trò |
| --- | --- | --- |
| `--primary` / `bg-primary` / `text-primary` | `#f7aa1b` | Accent chính, CTA, active state, focus ring nhẹ, highlight line |
| `--app` / `bg-app` | `#f8f6f2` | Nền toàn trang |
| `--subtle` / `bg-subtle` | `#f0ede7` | Nền section phụ, filter, bề mặt giảm tương phản |
| `--elevated` / `bg-elevated` | `#ffffff` | Nền nổi, panel sáng |
| `--surface` / `bg-surface` | `#ffffff` | Card và surface chính |
| `--footer` / `bg-footer` | `#26231f` | Footer nền tối riêng biệt |
| `--footer-heading` / `text-footer-heading` | `#f5f0e8` | Heading trong footer |
| `--footer-body` / `text-footer-body` | `#c8bfb2` | Body text trong footer |
| `--heading` / `text-heading` | `#18160f` | Heading, title, nội dung cần nhấn mạnh |
| `--body` / `text-body` | `#302d26` | Text chính toàn site |
| `--secondary` / `text-secondary` | `#6e6a62` | Metadata, helper text, label phụ |
| `--muted` / `text-muted` | `#a8a49e` | Text rất nhẹ, placeholder, divider hint |
| `--hairline` / `border-hairline` | `#3d200a18` | Hairline border rất nhẹ |
| `--hairline-strong` / `border-hairline-strong` | `#3d200a28` | Border cần tách lớp rõ hơn một chút |

### Cách dùng màu
- Primary chỉ nên xuất hiện ở CTA, link hover, active chip, badge nhỏ, ring và line accent.
- Background lớn nên giữ ở họ hàng `app`, `subtle`, `surface`, `elevated`.
- Text hierarchy phải đi từ `heading` đến `body` rồi mới đến `secondary` và `muted`.
- Footer là khu vực duy nhất trong hệ hiện tại dùng nền tối rõ ràng.

## 4. Semantic surface tokens
| Token | Định nghĩa trong code | Nhận xét |
| --- | --- | --- |
| `surface-card` | `bg-surface` + `border-hairline` + `rounded-xl` + `shadow-md` | Card tiêu chuẩn, dùng nhiều nhất |
| `surface-panel` | `bg-surface` + `border-hairline` + `rounded-[1.25rem]` + `shadow-sm` | Panel mềm hơn card, hợp block nội dung |
| `surface-float` | `bg-surface` + `border-hairline` + `shadow-lg` + `backdrop-blur-[18px]` | Popover, dropdown, toolbar sticky |

- Hệ surface hiện tại thiên về sáng, có border rất nhẹ và shadow mềm.
- Phần lớn component thực tế còn dùng shadow arbitrary theo ngữ cảnh, nên chưa có token shadow riêng ở cấp global.

## 5. Typography
- Font hệ thống là `Be Vietnam Pro` qua `next/font/google`.
- `html` có `h-full antialiased`; `body` kế thừa font và màu text của app.
- Không thấy token mono riêng trong `globals.css`; số liệu và nhãn kỹ thuật hiện chủ yếu dùng weight, tracking và hierarchy chứ không tách mono font thành chuẩn global.

### Quy ước chữ đang được dùng nhiều
- Heading lớn: `font-semibold`, tracking âm nhẹ, line-height chặt.
- Body: `text-sm` tới `text-lg`, line-height thoáng.
- Meta / label: `text-xs` hoặc `text-sm`, màu `secondary` hoặc `muted`.
- Overline / tiny label: uppercase, tracking rộng, chỉ dùng khi thật sự cần nhịp thị giác.

## 6. Layout và spacing
- `layout-container` là primitive trung tâm cho canh lề ngang.
- Max width chuẩn hiện tại là `80rem`.
- Padding ngang của container:
  - mobile: `1rem`
  - tablet: `1.5rem`
  - desktop: `2rem`
- Spacing dọc:
  - `layout-section-sm`: `2.5rem` rồi lên `3.5rem` từ `md`
  - `layout-section`: `3.5rem` rồi lên `5rem` từ `md`
  - `layout-section-lg`: `4.5rem` rồi lên `6rem` từ `md`
- `src/app/(main)/layout.tsx` bù `pt-16` cho main vì header fixed cao `64px`.
- Tránh lạm dụng `px-4 py-*` rải rác khi đã có primitive phù hợp.

## 7. Radius và shadow
- `rounded-lg`: input, button, chip nhỏ, control compact.
- `rounded-xl`: card, popover, panel phổ thông.
- `rounded-2xl`: hero block, modal, surface lớn, card premium.
- Shadow thực tế trong component:
  - card/controls thường dùng shadow mềm, thấp alpha.
  - popover/dialog/sheet dùng shadow lớn hơn, nhưng vẫn giữ cảm giác sạch.
  - CTA primary thường thêm shadow màu cam rất nhẹ để tăng độ nổi.

### Nguyên tắc shadow
- Shadow phải tạo chiều sâu, không tạo cảm giác nặng.
- Không dùng `shadow-sm` như mặc định thị giác cho toàn bộ UI.
- Nếu một pattern lặp lại ở nhiều nơi, ưu tiên chuẩn hóa qua token hoặc variant thay vì copy arbitrary shadow.

## 8. Control states và interaction
- Transition global trên link/button/input/select/textarea đang là khoảng `0.24s` cho color, background, border, shadow và transform.
- Hover chuẩn:
  - tăng shadow nhẹ hoặc nâng `-translate-y-0.5`
  - không scale mạnh
  - không bounce
- Focus-visible:
  - ring mềm, dùng accent alpha thấp
  - phải đọc được trên nền sáng
- Disabled:
  - giảm contrast có kiểm soát
  - không làm mất readability
  - không giữ hiệu ứng hover như trạng thái thường
- Selection text dùng primary và chữ trắng.

## 9. Component language hiện tại
- Header: fixed top, backdrop blur, nền `bg-app/92`, border bottom rất nhẹ.
- Footer: nền tối, text footer riêng, chia 2 tầng rõ ràng.
- Card/listing surface: thiên về card trắng, border hairline, hover lift rất nhẹ.
- Filter toolbar: sticky, dùng surface nổi, shadow mềm và blur nhẹ.
- Dialog, sheet, popover, select: đều đang đi theo ngôn ngữ “white surface + thin border + soft shadow + blur”.
- Buttons:
  - primary: nền cam, text trắng, shadow mềm
  - outline: nền trắng, border nhẹ, hover nhấn cam
  - ghost/link: text action
- Form controls:
  - nền trắng, border nhẹ, focus ring mềm
  - ưu tiên đọc rõ trước, đẹp sau

## 10. Motion và media
- Hover ảnh chỉ nên zoom nhẹ, không giật.
- Overlay chỉ dùng khi cần đảm bảo legibility.
- Skeleton nên phản ánh layout thật, không nên dùng spinner-only cho list và card.
- Loading, empty và error state đều phải giữ tone tĩnh, sáng và dễ đọc.

## 11. Kết luận áp dụng
- Hệ hiện tại là một light theme có token rõ cho màu, spacing và surface, nhưng shadow vẫn còn nhiều arbitrary value theo component.
- Khi chỉnh UI mới, ưu tiên dùng `bg-app`, `bg-subtle`, `surface-*`, `text-heading`, `text-body`, `layout-container` trước khi thêm class riêng.
- Nếu một pattern lặp lại trên 2 nơi trở lên, nên nâng lên token / primitive / variant thay vì patch local tiếp.
