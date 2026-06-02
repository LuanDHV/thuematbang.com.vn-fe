import AdminComingSoonPanel from "@/components/cms/admin/AdminComingSoonPanel";

export default function AdminPaymentsPage() {
  return (
    <AdminComingSoonPanel
      title="CMS Admin"
      description="Quản lý thanh toán theo endpoint payments của BE."
      notes={[
        "Hữu ích cho đối soát giao dịch và lịch sử thanh toán.",
        "Có thể phát triển thành bảng giao dịch, trạng thái, và thao tác nghiệp vụ.",
      ]}
    />
  );
}
