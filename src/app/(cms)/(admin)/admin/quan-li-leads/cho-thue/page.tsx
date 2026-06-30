import AdminLeadsPageSection from "@/components/cms/admin/AdminLeadsPageSection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminPropertyLeadsPage({ searchParams }: PageProps) {
  return (
    <AdminLeadsPageSection
      source="PROPERTY"
      pageTitle="Quản lý lead cho thuê"
      tableTitle="Lead cho thuê"
      pageDescription="Danh sách lead tạo từ các tin cho thuê."
      searchPlaceholder="Tìm kiếm tên hoặc số điện thoại"
      searchParams={searchParams}
    />
  );
}
