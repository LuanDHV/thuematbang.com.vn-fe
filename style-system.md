# Style System

## 1. Visual Direction
- Tinh thần thương hiệu: sáng ấm, cao cấp, tối giản, đáng tin cậy, sắc nét kiểu Western product design.
- Tránh Dark Mode cho các trang nhiều văn bản, thông số, filter và detail content.
- Giao diện phải tạo cảm giác rộng, yên tĩnh, có nhịp thở; không dùng quá nhiều border, không dùng mảng màu cam lớn.

## 2. Color System
- Brand Accent: `#fbaa19`
- Main Background: `#f7f7f4`
- Section / Filter Background: `#f2f1ed`
- Deep Separation / Footer Background: `#ebeae5`
- Card Surface: `#ffffff`
- Heading Text: ưu tiên `text-slate-900`, khi cần nhấn mạnh nhất dùng `text-black`
- Body Text: `text-slate-700`
- Muted Text: `text-slate-500`
- Hairline Border: chỉ dùng khi thật cần, ưu tiên `border-black/6` hoặc `border-slate-200/70`
- Success: `text-emerald-600`
- Warning: `text-amber-600`
- Error: `text-rose-600`
- Accent usage: chỉ cho CTA chính, active state, link hover, badge nhỏ, focus ring, highlight line

## 3. Semantic Tokens
- `bg-app`: nền toàn trang `#f7f7f4`
- `bg-subtle`: nền section phụ / filter `#f2f1ed`
- `bg-elevated`: nền phân tách sâu / footer `#ebeae5`
- `surface-card`: `bg-white` + `rounded-xl` + shadow mềm
- `surface-panel`: nền sáng ấm + shadow nhẹ, không nặng border
- `surface-float`: popover / dropdown / sticky toolbar có blur nhẹ và shadow nổi
- `text-heading`: heading chính
- `text-body`: nội dung chính
- `text-muted`: mô tả, metadata phụ
- `shadow-ambient`: shadow nền rất mềm cho container và section
- `shadow-soft`: shadow card chuẩn
- `shadow-float`: shadow dùng cho popover, dropdown, sticky toolbar

## 4. Spacing System
- Container ngang: mobile `px-4`, tablet `px-6`, desktop `px-8`
- Max width chuẩn: `max-w-7xl`
- `layout-section-sm`: `py-10 md:py-14`
- `layout-section`: `py-14 md:py-20`
- `layout-section-lg`: `py-18 md:py-24`
- Gap chuẩn: `gap-4`, `gap-6`, `gap-8`
- Card padding: `p-5 md:p-6`
- Premium panel padding: `p-6 md:p-8`
- Không tiếp tục dùng raw spacing rải rác làm chuẩn mới nếu có thể thay bằng primitive

## 5. Typography
- Root font phải quản trị bằng `next/font`
- Sans family: `Geist Sans`, fallback `system-ui`, `sans-serif`
- Mono family: `Geist Mono`, fallback `ui-monospace`, `monospace`
- Heading dùng chính `Geist Sans` với weight cao và tracking âm nhẹ để giữ sự sắc nét kiểu Cursor
- H1: `text-4xl md:text-6xl`, `font-semibold`, `tracking-[-0.03em]`, `leading-[1.02]`, `text-slate-900`
- H2: `text-3xl md:text-5xl`, `font-semibold`, `tracking-[-0.025em]`, `leading-[1.06]`
- H3: `text-xl md:text-2xl`, `font-semibold`, `tracking-[-0.02em]`
- Body large: `text-base md:text-lg`, `leading-8`, `font-normal`, `text-slate-700`
- Body default: `text-sm md:text-base`, `leading-7`, `font-normal`, `text-slate-700`
- Meta / label: `text-xs md:text-sm`, `font-medium`, `text-slate-500`
- Numeric data: dùng `Geist Mono`, `font-medium` hoặc `font-semibold`, tracking trung tính
- Chỉ dùng uppercase khi là category chip, overline hoặc tiny label thực sự cần nhịp thị giác

## 6. Radius and Shadows
- Input / button / chip: `rounded-lg`
- Card / dropdown / popover: `rounded-xl`
- Hero / large panel / modal lớn: `rounded-2xl`
- Shadow chuẩn card: mềm, rộng, alpha thấp; tránh `shadow-sm` như default thị giác
- Shadow gợi ý:
  - Ambient: `0 10px 30px rgba(15, 23, 42, 0.05)`
  - Soft: `0 18px 40px rgba(15, 23, 42, 0.08)`
  - Float: `0 24px 60px rgba(15, 23, 42, 0.12)`

## 7. Buttons and Interactive Elements
- Primary button: nền cam tinh gọn, chữ trắng, shadow tiết chế
- Secondary button: sáng, tinh gọn, border cực nhẹ hoặc subtle surface
- Ghost button: text action, hover rất nhẹ
- Hover chuẩn: tăng shadow nhẹ hoặc nâng `-translate-y-0.5`, không scale mạnh
- Focus-visible: ring rõ bằng accent alpha thấp, không gắt
- Disabled: giảm contrast, bỏ hover-lift, vẫn đọc được label

## 8. Forms
- Input / select / textarea phải sáng, sạch, thoáng, dễ đọc
- Default: nền trắng, text đậm vừa, border cực nhẹ hoặc shadow nội/ngoại rất tinh tế
- Hover: border hoặc shadow tăng rất nhẹ
- Focus: ring đồng bộ bằng accent mờ, không dùng viền đậm cứng
- Read-only: vẫn là surface sáng, giảm tương tác nhưng không làm mờ quá mức
- Disabled: giảm contrast, bỏ hover, icon và label vẫn rõ
- Error: ưu tiên text và ring đỏ dịu, tránh làm field quá nặng

## 9. Image and Media Behavior
- Hover ảnh: zoom nhẹ `1.02` đến `1.04`, easing mượt, không giật
- Overlay chỉ dùng khi cần giữ text legibility
- Card media phải cho cảm giác tĩnh, cao cấp, không animation thừa

## 10. Loading and States
- Skeleton phải theo layout thật, tone sáng ấm, shimmer rất nhẹ
- Empty state phải yên tĩnh, có CTA rõ
- Error state phải bình tĩnh, dễ đọc, không dùng khối đỏ lớn
- Sticky filters, sheets, drawers phải dùng nền sáng có blur nhẹ và shadow mềm

## 11. Mobile
- Giữ chất premium trên mobile bằng spacing thoáng, touch target >= `44px`
- Ưu tiên giảm số cột trước khi giảm cỡ chữ hoặc nén tap area
- Drawer / filter mobile có header rõ, footer action sticky khi cần
