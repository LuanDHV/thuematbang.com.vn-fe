import Image from "next/image";
import { MapPin } from "lucide-react";
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
    <footer className="bg-footer text-body mt-auto w-full border-t border-black/6">
      <div className="layout-container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-8">
            <div className="relative h-20 w-64 sm:h-24 sm:w-72">
              <Link href="/" className="block h-full w-full">
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
              <h2 className="text-heading mb-3 text-base font-semibold tracking-[-0.02em] md:text-lg">
                CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO THUEMATBANG
              </h2>
              <div className="text-body flex items-start gap-2 text-sm leading-7">
                <MapPin size={18} className="text-primary mt-1 shrink-0" />
                <span>
                  708-710-712 Cách Mạng Tháng 8, P. Tân Sơn Nhất, Q. Tân Bình,
                  TP. HCM
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-heading mb-4 text-sm font-semibold tracking-[0.16em] uppercase">
                Về chúng tôi
              </h3>
              <ul className="text-body flex flex-col gap-3 text-sm">
                {aboutLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-primary block transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-heading mb-4 text-sm font-semibold tracking-[0.16em] uppercase">
                Quy định
              </h3>
              <ul className="text-body flex flex-col gap-3 text-sm">
                {policyLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="hover:text-primary block transition-colors duration-300"
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

      <div className="border-t border-black/6">
        <div className="layout-container py-4">
          <div className="text-muted text-center text-xs font-semibold tracking-[0.18em] uppercase">
            Copyright © 2026 Thuematbang
          </div>
        </div>
      </div>
    </footer>
  );
}
