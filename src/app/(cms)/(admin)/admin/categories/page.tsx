import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminCategoriesPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý danh mục nội dung theo các endpoint categories từ BE."
      notes={[
        "Phù hợp để map category cho properties, projects, news, và rent requests.",
        "Có thể mở rộng thành bảng CRUD khi FE có contract đủ rõ.",
      ]}
    />
  );
}
