import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminBannersPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý banner theo endpoint thật từ BE, sẵn sàng nối list/create/update/delete sau."
      notes={[
        "BE đã có các endpoint banners để dựng CRUD.",
        "Trang này dùng chung shell admin và sẽ giữ đúng layout khi cắm API thật.",
      ]}
    />
  );
}
