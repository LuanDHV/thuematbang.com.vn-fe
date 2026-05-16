import Image from "next/image";
import { Phone, Mail, MapPin, Headphones, Clock8 } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const aboutLinks = [
    { label: "Giới thiệu", href: "#" },
    { label: "Liên hệ", href: "#" },
    { label: "Câu hỏi thường gặp", href: "#" },
    { label: "Tin tức", href: "#" },
  ];
  const policyLinks = [
    { label: "Quy chế hoạt động", href: "#" },
    { label: "Chính sách bảo mật thông tin", href: "#" },
    { label: "Cơ chế giải quyết tranh chấp, khiếu nại", href: "#" },
    { label: "Điều khoản thỏa thuận", href: "#" },
    { label: "Quy định đăng tin", href: "#" },
  ];

  return (
    <footer className="to-primary/10 mt-auto w-full border-t border-gray-100 bg-white bg-linear-to-b from-white font-sans text-gray-700">
      {/* SECTION 1: TOP INFO BAR */}
      <div className="w-full border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Phone size={18} />,
                label: "Hotline",
                value: "0968 68 80 81",
              },
              {
                icon: <Headphones size={18} />,
                label: "Tư vấn",
                value: "24/7 Support",
              },
              {
                icon: <Mail size={18} />,
                label: "Email",
                value: "contact@thuematbang.com.vn",
              },
              {
                icon: <Clock8 size={18} />,
                label: "Giờ làm việc",
                value: "Thứ 2 - Thứ 7: 08:00 - 18:00",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-primary shrink-0 rounded-full p-2.5 text-white shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="mb-1 text-[10px] leading-none font-bold tracking-widest text-gray-400 uppercase">
                    {item.label}
                  </p>
                  <span className="text-[13px] font-bold text-gray-700">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: MAIN CONTENT */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* CỘT TRÁI (1/2): Logo & Social */}
            <div className="space-y-8">
              <div className="relative h-20 w-64 sm:h-24 sm:w-72">
                <Link href={"/"} className="block h-full w-full">
                  <Image
                    src="/imgs/brand-logo.png"
                    alt="thuematbang-logo"
                    width={280}
                    height={80}
                    priority
                    className="h-full w-full object-contain object-left"
                  />
                </Link>
              </div>
              <div className="max-w-xl">
                <h2 className="text-primary mb-3 text-base leading-tight font-black uppercase md:text-lg">
                  CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO THUEMATBANG
                </h2>
                <div className="flex items-center gap-2 text-base leading-relaxed text-gray-500">
                  <MapPin size={20} className="text-primary mt-1 shrink-0" />
                  <span>
                    708-710-712 Cách Mạng Tháng 8, P. Tân Sơn Nhất, Q. Tân Bình,
                    TP. HCM
                  </span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (1/2): 2 Cột Menu */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {/* Menu 1 */}
              <div>
                <h3 className="after:bg-primary relative mb-3 pb-2 text-base font-bold tracking-tight text-gray-700 uppercase after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-8 after:rounded-full after:content-['']">
                  Về chúng tôi
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {aboutLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="hover:text-primary block transition duration-300 hover:translate-x-1"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Menu 2 */}
              <div>
                <h3 className="after:bg-primary relative mb-3 pb-2 text-base font-bold tracking-tight text-gray-700 uppercase after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-8 after:rounded-full after:content-['']">
                  Quy định
                </h3>
                <ul className="space-y-3.5 text-sm text-gray-600">
                  {policyLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="hover:text-primary block transition duration-300 hover:translate-x-1"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LEGAL INFO */}
      <div className="w-full border-t border-gray-100">
        <div className="mx-auto max-w-7xl p-4">
          <div className="text-primary text-center text-xs font-bold tracking-widest uppercase">
            Copyright © 2026 Thuematbang
          </div>
        </div>
      </div>
    </footer>
  );
}
