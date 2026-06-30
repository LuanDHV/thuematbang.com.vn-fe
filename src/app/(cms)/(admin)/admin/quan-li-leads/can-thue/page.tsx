import AdminLeadsPageSection from "@/components/cms/admin/AdminLeadsPageSection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminRentRequestLeadsPage({ searchParams }: PageProps) {
  return (
    <AdminLeadsPageSection
      source="RENT_REQUEST"
      pageTitle="Quản lý lead cần thuê"
      tableTitle="Lead cần thuê"
      pageDescription="Danh sách lead tạo từ các tin cần thuê."
      searchPlaceholder="Tìm kiếm tên hoặc số điện thoại"
      searchParams={searchParams}
    />
  );
}
