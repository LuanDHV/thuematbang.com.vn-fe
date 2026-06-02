import AdminManagementShell from "@/components/cms/admin/AdminManagementShell";

const DASHBOARD_CARDS = [
  { label: "Tin đăng", value: "128", note: "Đang hoạt động" },
  { label: "Yêu cầu", value: "42", note: "Chờ xử lý" },
  { label: "Người dùng", value: "18", note: "Mới trong tuần" },
  { label: "Media", value: "94", note: "Đã đồng bộ" },
];

export default function AdminDashboardPage() {
  return (
    <AdminManagementShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_CARDS.map((card) => (
          <article key={card.label} className="surface-card p-5">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              {card.label}
            </p>
            <p className="text-heading mt-3 text-3xl font-semibold tracking-[-0.03em]">
              {card.value}
            </p>
            <p className="text-secondary mt-1 text-sm">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="surface-panel mt-6 p-5">
        <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
          Bảng điều khiển mẫu
        </h2>
        <p className="text-secondary mt-2 text-sm leading-6">
          Khu admin đã được gom chung trong `(cms)/(admin)` và đang dùng chung
          layout với khu user. Phần module quản trị thật có thể cắm tiếp vào
          khung này mà không đổi shell.
        </p>
      </section>
    </AdminManagementShell>
  );
}
