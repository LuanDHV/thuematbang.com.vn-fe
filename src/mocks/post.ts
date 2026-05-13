import { News } from "../types/news";
import { mockCategoryNews } from "./categories";

const now = "2026-05-13T09:00:00.000Z";

const getNewsCategory = (id: number) =>
  mockCategoryNews.find((category) => category.id === id) ?? null;

export const mockNews: News[] = [
  {
    id: 9001,
    categoryId: 301,
    title: "Giá thuê mặt bằng bán lẻ tại quận 1 tăng 8% quý II/2026",
    slug: "gia-thue-mat-bang-ban-le-quan-1-tang-8-phan-tram-q2-2026",
    thumbnailUrl: "/imgs/wallpaper-1.jpg",
    summary:
      "Phân khúc mặt bằng trung tâm tiếp tục tăng do nhu cầu mở rộng chuỗi F&B và thời trang.",
    content:
      "<p>Thị trường cho thuê mặt bằng tại quận 1 ghi nhận đà tăng rõ rệt...</p>",
    viewCount: 1290,
    status: "PUBLISHED",
    isFeatured: true,
    createdAt: "2026-05-12T03:00:00.000Z",
    updatedAt: now,
    category: getNewsCategory(301),
  },
  {
    id: 9002,
    categoryId: 302,
    title: "5 điều khoản cần có trong hợp đồng thuê văn phòng",
    slug: "5-dieu-khoan-can-co-trong-hop-dong-thue-van-phong",
    thumbnailUrl: "/imgs/wallpaper-2.jpg",
    summary:
      "Checklist pháp lý giúp doanh nghiệp tránh tranh chấp khi thuê dài hạn.",
    content:
      "<p>Khi ký hợp đồng thuê văn phòng, cần rà soát các điều khoản...</p>",
    viewCount: 740,
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: "2026-05-10T09:00:00.000Z",
    updatedAt: now,
    category: getNewsCategory(302),
  },
  {
    id: 9003,
    categoryId: 303,
    title: "Kinh nghiệm chọn khu vực mở cửa hàng đầu tiên",
    slug: "kinh-nghiem-chon-khu-vuc-mo-cua-hang-dau-tien",
    thumbnailUrl: "/imgs/wallpaper-1.jpg",
    summary:
      "Gợi ý các tiêu chí đo lưu lượng khách, chi phí vận hành và mức độ cạnh tranh.",
    content:
      "<p>Để mở cửa hàng hiệu quả, bạn nên bắt đầu từ bài toán vị trí...</p>",
    viewCount: 560,
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: "2026-05-09T07:00:00.000Z",
    updatedAt: now,
    category: getNewsCategory(303),
  },
  {
    id: 9004,
    categoryId: 301,
    title: "Nguồn cung kho xưởng ven đô tăng nhanh",
    slug: "nguon-cung-kho-xuong-ven-do-tang-nhanh",
    thumbnailUrl: "/imgs/wallpaper-2.jpg",
    summary:
      "Nhiều dự án hậu cần mới hoàn thiện giúp doanh nghiệp có thêm lựa chọn.",
    content:
      "<p>Thị trường kho xưởng có thêm nguồn cung tại các trục vành đai...</p>",
    viewCount: 430,
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: "2026-05-08T11:00:00.000Z",
    updatedAt: now,
    category: getNewsCategory(301),
  },
];

// Legacy export name for existing components.
export const mockPosts = mockNews;
