export default function UserMyRentRequestsPage() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS User
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Nhu cầu thuê của tôi
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Danh sách nhu cầu thuê của bạn sẽ được nối từ endpoint `/me/rent-requests`.
        </p>
      </div>

      <article className="surface-panel p-6">
        <p className="text-secondary text-sm leading-6">
          Trang này đã có route và nav item. Khi cần hiển thị dữ liệu thật, nối
          vào API `/me/rent-requests` và render table theo cùng pattern CMS.
        </p>
      </article>
    </section>
  );
}
