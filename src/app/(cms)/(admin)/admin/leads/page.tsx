import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminLeadsPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý lead và lịch sử liên hệ từ endpoint leads của BE."
      notes={[
        "Trang này là nơi theo dõi yêu cầu phát sinh từ form và tương tác người dùng.",
        "Có thể gắn action xem chi tiết, gắn trạng thái xử lý và lọc theo nguồn.",
      ]}
    />
  );
}
