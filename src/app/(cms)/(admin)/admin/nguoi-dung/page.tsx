import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminNguoiDungPage() {
  return (
    <AdminComingSoonPanel
      title="Quản lý người dùng"
      description="Route đã có trong sidebar để chuẩn hóa ownership, nhưng hiện tại FE chưa có endpoint list user thật an toàn để render bảng quản trị."
      notes={[
        "Sau khi backend có endpoint list user, màn hình này sẽ dùng cùng table/action pattern.",
        "Hiện chỉ giữ route, layout và wording để không đứt navigation.",
      ]}
    />
  );
}
