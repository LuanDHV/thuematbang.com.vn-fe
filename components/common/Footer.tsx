export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Về chúng tôi</h3>
            <p className="text-gray-400">
              thuematbang.com.vn - Nền tảng chia sẻ kiến thức về phong thủy.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="transition hover:text-white">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/posts" className="transition hover:text-white">
                  Bài viết
                </a>
              </li>
              <li>
                <a href="/contact" className="transition hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@thuematbang.com.vn</li>
              <li>Điện thoại: +84 1234 567 890</li>
              <li>Địa chỉ: Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 text-center text-gray-400">
          <p>&copy; 2024 thuematbang.com.vn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
