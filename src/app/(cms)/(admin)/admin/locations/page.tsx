import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminLocationsPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý dữ liệu địa điểm theo các endpoint locations của BE."
      notes={[
        "BE hiện có endpoint provinces, wards, streets để phục vụ lookup.",
        "Nếu cần CRUD sâu hơn, có thể bổ sung page quản trị riêng sau.",
      ]}
    />
  );
}
