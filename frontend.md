# Frontend Rules

## 1. Safe Refactor Boundary
- Chỉ refactor presentation layer.
- Không sửa fetch logic, React Query hooks, Zustand stores, validation schema, handlers, query params, mutation flow, routing, data mapping.
- Không đổi props contract, không đổi semantics filter, không đổi event wiring.
- Nếu đổi markup để phục vụ layout, output và interaction phải giữ nguyên.

## 2. Separation of Concerns
- Logic ở container/hook hiện hữu.
- Styling ở token, primitive, variant và presentational subcomponent.
- Không trộn business condition với visual-only class decision nếu có thể tách ra.
- Mọi thay đổi phải an toàn với tiếng Việt và lưu file UTF-8.

## 3. Styling Priority
- Ưu tiên theo thứ tự:
  1. semantic token trong `globals.css`
  2. shared primitive như `layout-section`, `surface-card`, `text-muted`
  3. shared UI variants
  4. local override khi thật sự bắt buộc
- Không xem `bg-white`, `border-gray-200`, `text-gray-700`, `shadow-sm`, `py-*` rải rác là chuẩn mới.
- Mọi class cứng mới phải có lý do rõ ràng; nếu lặp lại từ 2 nơi trở lên thì nâng cấp thành token hoặc primitive.

## 4. Form and Input States
- Mọi field phải có đủ default, hover, focus, disabled, readOnly, error.
- Hover: tăng độ rõ rất nhẹ, không đổi layout.
- Focus: dùng ring tinh tế, nhất quán, dễ thấy trên nền sáng.
- Disabled: không hover, contrast giảm có kiểm soát, vẫn đọc được value.
- Read-only: phân biệt với editable nhưng không bị mờ như disabled.
- Error: message đặt ngay dưới field, spacing đồng bộ, tone lỗi dịu.
- Label, helper, error text phải theo cùng hierarchy typography toàn site.

## 5. Premium Interaction Rules
- Hover ảnh: zoom nhẹ, easing mượt, không bounce, không scale mạnh.
- Hover card: chỉ nâng rất nhẹ hoặc tăng shadow mềm.
- Hover CTA: phản hồi rõ nhưng tiết chế; không dùng quá nhiều glow.
- Skeleton loading: dùng skeleton theo shape thật thay vì spinner-only cho list, card, detail header, filter placeholders.
- Drawer, popover, sheet phải mở mượt, không giật, không dùng animation khoa trương.

## 6. Component Refactor Order
- Bắt đầu từ `globals.css` và root layout.
- Sau đó tới shared UI primitives: button, input, select, card, tabs, popover, sheet.
- Tiếp theo là `Header`, `Footer`, breadcrumb, title block.
- Sau đó migrate `listing-filter`, property/project/news cards, list results.
- Cuối cùng mới tới detail pages, auth/account surfaces và các local page wrappers.

## 7. UX Rules for Real-Estate Screens
- Filter phải đọc nhanh, phân cấp rõ, selected state dễ nhận diện.
- Card phải ưu tiên title, giá, diện tích, vị trí, CTA liên hệ hoặc affordance rõ ràng.
- Detail page phải đẩy thông tin quan trọng lên đầu, sidebar rõ nhưng không nặng.
- Accent cam chỉ là điểm nhấn; nội dung chính phải dựa vào hierarchy, spacing và typography chứ không dựa vào màu chói.

## 8. QA and Drift Prevention
- Sau mỗi batch migrate phải kiểm tra desktop và mobile.
- Kiểm tra không vỡ interaction ở filter, dialog, popover, form submission, tab switching.
- Chạy `npx.cmd tsc --noEmit` sau batch lớn.
- Search drift cho các class light cứng trong `src/app` và `src/components`.
- QA riêng cho UTF-8 tiếng Việt ở markdown, label, placeholder, heading và helper text.

## 9. Definition of Done
- Không có regression logic.
- Light Mode token áp dụng nhất quán.
- Typography hierarchy rõ hơn hiện trạng.
- Border thô giảm, shadow mềm tăng đúng mức.
- Form, button, card, overlay và skeleton nói cùng một ngôn ngữ thị giác.
- Header, footer, filter, listing card và detail surfaces không còn cảm giác mỗi chỗ một kiểu.
