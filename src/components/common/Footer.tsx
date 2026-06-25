import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const aboutLinks = [
    { label: "Giới thiệu", href: "/gioi-thieu" },
    { label: "Liên hệ", href: "/lien-he" },
    { label: "Câu hỏi thường gặp", href: "/cau-hoi-thuong-gap" },
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
    <footer className="bg-footer text-footer-body border-footer-border mt-auto w-full border-t">
      <div className="layout-container py-12 md:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <div className="relative h-16 w-56 sm:h-20 sm:w-64">
              <Link href="/" className="relative block h-full w-full">
                <Image
                  src="/imgs/logo-TMB-white.png"
                  alt="Thuematbang.com.vn"
                  fill
                  sizes="(max-width: 640px) 14rem, 16rem"
                  priority
                  className="object-contain object-left"
                />
              </Link>
            </div>
            <div className="max-w-xl space-y-3">
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
                Thuematbang
              </p>
              <h2 className="text-footer-heading text-base font-semibold tracking-[-0.02em] md:text-lg">
                CÔNG TY TNHH DỊCH VỤ QUẢNG CÁO THUEMATBANG
              </h2>
              <div className="text-footer-body flex items-start gap-2 text-sm leading-7">
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
              <h3 className="text-footer-heading mb-4 text-xs font-semibold tracking-[0.22em] uppercase">
                Về chúng tôi
              </h3>
              <ul className="text-footer-body flex flex-col gap-3 text-sm">
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
              <h3 className="text-footer-heading mb-4 text-xs font-semibold tracking-[0.22em] uppercase">
                Quy định
              </h3>
              <ul className="text-footer-body flex flex-col gap-3 text-sm">
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

      <div className="border-footer-border border-t">
        <div className="layout-container py-5">
          <div className="text-footer-body text-center text-xs font-semibold tracking-[0.24em] uppercase">
            Copyright © 2026 Thuematbang
          </div>
        </div>
      </div>
    </footer>
  );
}
