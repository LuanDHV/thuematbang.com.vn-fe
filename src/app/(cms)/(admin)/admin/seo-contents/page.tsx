import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminSeoContentsPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý nội dung SEO theo endpoint seo-contents của BE."
      notes={[
        "Đây là khu vực phù hợp cho nội dung page SEO theo page/category.",
        "Sau này có thể cắm editor và danh sách theo page/:page.",
      ]}
    />
  );
}
