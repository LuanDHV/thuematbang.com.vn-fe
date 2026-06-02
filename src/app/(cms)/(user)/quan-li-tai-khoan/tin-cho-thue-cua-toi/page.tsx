export default function UserMyPropertiesPage() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
          CMS User
        </p>
        <h1 className="text-heading text-xl font-semibold tracking-[-0.03em] md:text-2xl">
          Tin cho thuê của tôi
        </h1>
        <p className="text-secondary text-sm leading-7 md:text-base">
          Danh sách tin cho thuê của bạn sẽ được nối từ endpoint `/me/properties`.
        </p>
      </div>

      <article className="surface-panel p-6">
        <p className="text-secondary text-sm leading-6">
          Trang này đã có route và nav item. Khi cần hiển thị dữ liệu thật, nối
          vào API `/me/properties` và render table theo cùng pattern CMS.
        </p>
      </article>
    </section>
  );
}
