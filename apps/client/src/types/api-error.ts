// Định nghĩa danh sách các mã lỗi API có thể xảy ra
export type ApiErrorCode =
  | "BAD_REQUEST" // Lỗi dữ liệu gửi lên không hợp lệ
  | "UNAUTHORIZED" // Lỗi chưa đăng nhập / không có quyền truy cập chung
  | "FORBIDDEN" // Lỗi bị cấm truy cập vào tài nguyên cụ thể này
  | "NOT_FOUND" // Lỗi không tìm thấy tài nguyên
  | "CONFLICT" // Lỗi xung đột dữ liệu (ví dụ: trùng email)
  | "UNPROCESSABLE_ENTITY" // Lỗi dữ liệu đúng định dạng nhưng không thể xử lý
  | "TOO_MANY_REQUESTS" // Lỗi gửi quá nhiều yêu cầu trong thời gian ngắn
  | "UPSTREAM_ERROR" // Lỗi từ máy chủ trung gian hoặc bên thứ ba
  | "CONNECTION_FAILED" // Lỗi mất kết nối mạng
  | "INTERNAL_ERROR"; // Lỗi hệ thống nội bộ của server

// Định nghĩa cấu trúc chuẩn của một phản hồi (response) báo lỗi từ API
export type ApiErrorResponse = {
  success: false; // Luôn luôn là false đối với phản hồi lỗi
  error: {
    code: ApiErrorCode; // Mã lỗi định danh (thuộc danh sách phía trên)
    message: string; // Tin nhắn mô tả chi tiết bằng chữ về lỗi
    statusCode: number; // Mã trạng thái HTTP (ví dụ: 400, 401, 500)
    retryable: boolean; // Có thể gửi lại yêu cầu này lần nữa hay không
    details?: unknown; // Thông tin lỗi bổ sung (nếu có, không bắt buộc)
  };
};

// Hàm kiểm tra (Type Guard) xem một dữ liệu bất kỳ có phải là ApiErrorResponse hay không
export function isApiErrorResponse(
  payload: unknown,
): payload is ApiErrorResponse {
  // 1. Nếu dữ liệu trống hoặc không phải là một đối tượng (object) -> Không phải lỗi API
  if (!payload || typeof payload !== "object") return false;

  const record = payload as Record<string, unknown>;
  // 2. Nếu thuộc tính 'success' không phải là 'false' -> Không phải lỗi API
  if (record.success !== false) return false;

  const error = record.error;
  // 3. Nếu không có thuộc tính 'error' hoặc 'error' không phải object -> Không phải lỗi API
  if (!error || typeof error !== "object") return false;

  const errorRecord = error as Record<string, unknown>;
  // 4. Kiểm tra xem các thuộc tính bắt buộc của error có đúng kiểu dữ liệu không
  return (
    typeof errorRecord.code === "string" && // 'code' phải là chuỗi
    typeof errorRecord.message === "string" && // 'message' phải là chuỗi
    typeof errorRecord.statusCode === "number" // 'statusCode' phải là số
  );
}
