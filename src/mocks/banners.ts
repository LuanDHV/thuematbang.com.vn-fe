import { Banner } from "../types/banner";

export const mockBanners: Banner[] = [
  {
    id: 1,
    title: "Ưu đãi đăng tin Gold tháng 5",
    imageUrl: "/imgs/wallpaper-1.jpg",
    targetLink: "/bang-gia",
    position: "home_top",
    sortOrder: 1,
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Đăng ký tài khoản nhận 2 lượt đăng miễn phí",
    imageUrl: "/imgs/wallpaper-2.jpg",
    targetLink: "/dang-ky",
    position: "home_top",
    sortOrder: 2,
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Gói đẩy tin Silver tiết kiệm",
    imageUrl: "/imgs/wallpaper-1.jpg",
    targetLink: "/goi-day-tin",
    position: "sidebar",
    sortOrder: 1,
    isActive: true,
    createdAt: "2026-05-01T00:00:00.000Z",
  },
];
