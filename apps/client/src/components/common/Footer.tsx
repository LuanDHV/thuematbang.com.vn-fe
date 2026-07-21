import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const aboutLinks = [
    { label: "Giới thiệu", href: "/gioi-thieu" },
    { label: "Tin cho thuê", href: "/cho-thue" },
    { label: "Nhu cầu thuê", href: "/can-thue" },
    { label: "Dự án", href: "/du-an" },
    { label: "Tin tức", href: "/tin-tuc" },
  ];
  const policyLinks = [
    { label: "Quy chế hoạt động", href: "/quy-che-hoat-dong" },
    {
      label: "Chính sách bảo mật thông tin",
      href: "/chinh-sach-bao-mat-thong-tin",
    },
    {
      label: "Giải quyết tranh chấp, khiếu nại",
      href: "/giai-quyet-tranh-chap-khieu-nai",
    },
    { label: "Điều khoản thỏa thuận", href: "/dieu-khoan-thoa-thuan" },
    { label: "Quy định đăng tin", href: "/quy-dinh-dang-tin" },
  ];

  return (
    <footer
      className="border-inverse-border text-inverse mt-auto w-full border-t bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/imgs/footer-bg-background.webp')" }}
    >
      <div className="layout-container py-12 md:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="relative h-16 w-56 lg:h-24 lg:w-64">
              <Link href="/" className="relative block h-full w-full">
                <Image
                  src="/imgs/logo-TMB-black.webp"
                  alt="Thuematbang.com.vn"
                  fill
                  sizes="(max-width: 640px) 14rem, 16rem"
                  className="object-contain object-left"
                />
              </Link>
            </div>
            <div className="max-w-xl space-y-3">
              <h2 className="text-inverse text-base font-bold tracking-[-0.02em] md:text-lg">
                CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO THUEMATBANG.COM.VN
              </h2>
              <div className="text-inverse flex items-start gap-2 text-sm leading-7">
                <MapPin size={18} className="text-inverse mt-1 shrink-0" />
                <span>
                  708-710-712 Cách Mạng Tháng 8, P. Tân Sơn Nhất, Q. Tân Bình,
                  TP. HCM
                </span>
              </div>

              <div className="text-inverse flex items-start gap-2 text-sm leading-7">
                <Phone size={18} className="text-inverse mt-1 shrink-0" />
                <a
                  href="tel:0968688081"
                  className="transition-colors hover:text-white"
                >
                  0968 68 80 81
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-inverse mb-4 text-xs font-bold tracking-[0.22em] uppercase">
                Về chúng tôi
              </h3>
              <ul className="text-inverse flex flex-col gap-3 text-sm">
                {aboutLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-inverse mb-4 text-xs font-bold tracking-[0.22em] uppercase">
                Quy định
              </h3>
              <ul className="text-inverse flex flex-col gap-3 text-sm">
                {policyLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block transition-colors duration-300 hover:text-white"
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

      <div className="border-inverse-border border-t">
        <div className="layout-container py-5">
          <div className="text-inverse text-center text-xs font-bold tracking-[0.24em] uppercase">
            Copyright © 2026 Thuematbang
          </div>
        </div>
      </div>
    </footer>
  );
}
