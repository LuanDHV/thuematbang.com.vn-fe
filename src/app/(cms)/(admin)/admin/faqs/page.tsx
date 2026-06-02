import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminFaqsPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý FAQ từ endpoint faqs của BE."
      notes={[
        "Endpoint list đã có, có thể dùng cho trang hỗ trợ và FAQ nội dung.",
        "Giữ sẵn route để sau này cắm bảng và form chỉnh sửa.",
      ]}
    />
  );
}
