# Frontend UI Context Rules (thuematbang.com.vn-fe)

Mục tiêu: Dùng file này làm context chuẩn cho mọi task xây dựng giao diện mới, để UI đồng bộ với codebase hiện tại.

## 1) Tech & Component Rules

- Ưu tiên dùng `shadcn` components trong `src/components/ui` trước khi tự dựng mới.
- Luôn dùng helper `cn()` từ `@/lib/utils` để merge className.
- Rule shadcn bắt buộc:
  - Content chính luôn nằm trong container: `max-w-7xl mx-auto`.
  - Padding viền ngoài cùng mặc định: `px-5`.
  - Bo góc nhẹ: ưu tiên `rounded-xl` (chỉ tăng lên `rounded-2xl` khi có lý do rõ ràng).
  - Luôn dùng `gap-*` để tạo khoảng cách giữa phần tử, tránh `space-*`.
  - `PopoverContent` luôn canh giữa theo thẻ cha (align center).
  - Đồng bộ tên class Tailwind: ưu tiên class theo scale hệ thống (`w-*`, `h-*`, `px-*`, `py-*`) thay vì arbitrary value (`w-[...]`, `h-[...]`) nếu có lựa chọn tương đương.
- Với button/link hành động:
  - Ưu tiên `Button` từ `@/components/ui/button`.
  - Nếu dùng element click custom (`div`, `span`, `a`, `button`) thì luôn có `cursor-pointer` (trừ disabled).
- Icons dùng `lucide-react`.
- Quy ước icon:
  - Kích thước tối thiểu cho icon tương tác: `h-5 w-5`.
  - Nếu chiều rộng và chiều cao bằng nhau, ưu tiên dùng `size-*` (ví dụ `size-5`) thay cho tách `h-* w-*`.
- Ảnh luôn dùng `Image` của Next.js (`next/image`) kèm đầy đủ thuộc tính cần thiết (`src`, `alt`, `width`, `height` hoặc `fill` + `sizes`).
- Với ảnh từ API/Cloudinary: luôn ưu tiên URL transform tối ưu `f_auto,q_auto`.

## 2) Color & Theme Rules

- Primary color là token hệ thống:
  - `bg-primary`, `text-primary`, `border-primary`, `focus-visible:*primary*`.
- Text color ưu tiên theo token trong `globals.css`:
  - Heading: `text-text-heading`
  - Body: `text-text-body`
  - Secondary: `text-text-secondary`
- Không hardcode màu brand mới khi chưa có yêu cầu.
- Các vùng nền/card mặc định:
  - Page background phụ ưu tiên: `to-primary/10 bg-linear-to-b` (thường đi cùng `from-white`).
  - Trường hợp dashboard/account cần nền trung tính có thể dùng `#F3F4F6`.
  - Card: `bg-white`.
  - Border card/input: `border-gray-200` (hoặc gần tương đương theo component gốc).

## 3) Layout & Spacing Rules

- Ưu tiên container kiểu:
  - `mx-auto w-full max-w-7xl px-5` cho layout chính.
  - `max-w-2xl` / `max-w-4xl` cho form/detail hẹp.
- Padding dọc giữa các section/screen mặc định: `py-8`.
- Card pattern chuẩn trong repo:
  - `rounded-2xl bg-white shadow-sm` + border nhẹ khi cần.
- Grid/Flex dashboard:
  - Sidebar + content dùng `grid` hoặc `flex` với `gap-6`.
- Không phá vỡ layout route hiện có nếu chưa được yêu cầu.

## 4) Interaction & States Rules

- Tất cả element tương tác phải có đủ state:
  - `hover:*`, `focus-visible:*`, `disabled:*`.
- Active state của nav/tab:
  - Dùng `text-primary`, icon `text-primary`, và background nhẹ `bg-primary/10` hoặc indicator riêng.
- Form submit/loading:
  - Hiển thị loading rõ ràng (`Loader2 animate-spin`) và disable button khi pending.
- Error/success message:
  - Error: `text-red-600`
  - Success: `text-green-600`

## 5) Form Rules (RHF + Zod)

- Form mới dùng:
  - `react-hook-form`
  - `zod` + `@hookform/resolvers/zod`
- Label rõ ràng, message lỗi theo từng field ngay dưới input.
- Field readonly/disabled phải thể hiện rõ bằng UI.

## 6) Accessibility & UX Rules

- Ảnh phải có `alt` có nghĩa.
- Nút/icon-only cần có `aria-label`.
- Không dùng click handler cho element không semantic nếu có thể thay bằng `button`/`a`.
- Vùng click đủ lớn, không quá sát nhau.

## 7) Visual Consistency Rules

- Bo góc mặc định: `rounded-xl` (nhẹ).
- Typography:
  - Title: `font-semibold`/`font-bold` + `text-text-heading` (fallback: `text-gray-900` nếu cần tương thích).
  - Body: `text-sm text-text-body` / `text-text-secondary` theo cấp thông tin.
- Motion nhẹ, không lạm dụng:
  - `transition-colors`, `transition-all duration-200/300`.

## 8) Code Quality Rules

- Không tạo component mới nếu có thể tái sử dụng component hiện có.
- Nếu tạo variant mới cho UI component thì thêm theo pattern `cva` hiện tại.
- Tránh duplicate class/style logic giữa các file; tách helper khi bị lặp.

## 9) Pre-merge Checklist (Frontend)

- Đã dùng đúng shadcn component chưa?
- Có dùng token `primary` cho hành động chính chưa?
- Tất cả phần tử clickable đã có `cursor-pointer` (hoặc dùng `Button`) chưa?
- Có đủ hover/focus/disabled state chưa?
- Card/layout có đồng bộ `rounded-2xl`, `bg-white`, `shadow-sm` không?
- TypeScript check pass: `npx.cmd tsc --noEmit`.

## 10) Prompt Template cho Agent

Sử dụng template sau khi giao task UI mới:

"""
Hãy implement UI theo rule trong `frontend.md`.
Bắt buộc:

1. Ưu tiên shadcn components hiện có.
2. Dùng màu token `primary` cho CTA/active/focus.
3. Mọi element clickable phải có `cursor-pointer` (hoặc dùng `Button` chuẩn).
4. Card style thống nhất: `rounded-2xl`, `bg-white`, `shadow-sm`, border nhẹ.
5. Container chính dùng `max-w-7xl mx-auto px-5`.
6. Dùng `gap` thay vì `space`.
7. Ưu tiên class theo scale (`w-*`, `h-*`, `px-*`, `py-*`) thay vì arbitrary value (`w-[...]`) nếu có thể.
8. Padding dọc section/screen mặc định `py-8`.
9. Popover luôn align center với trigger cha.
10. Ảnh luôn dùng `next/image`; ảnh API/Cloudinary phải có `f_auto,q_auto`.
11. Icon tối thiểu `h-5 w-5`; nếu vuông thì dùng `size-*`.
12. Ưu tiên text token `text-text-heading`, `text-text-body`, `text-text-secondary`.
13. Background phụ ưu tiên `from-white to-primary/10 bg-linear-to-b`.
14. Có đầy đủ hover/focus/disabled states.
15. Không phá vỡ layout/logic hiện có nếu tôi không yêu cầu.
16. Chạy `npx.cmd tsc --noEmit` sau khi sửa.
    """
