import { ProjectImage } from "../types/media";
import { Project } from "../types/project";
import { mockCategoryProject } from "./categories";
import { mockCities, mockDistricts, mockWards } from "./locations";

const getCategory = (id: number) =>
  mockCategoryProject.find((category) => category.id === id) ?? null;
const getCity = (id: number) =>
  mockCities.find((city) => city.id === id) ?? null;
const getDistrict = (id: number) =>
  mockDistricts.find((district) => district.id === id) ?? null;
const getWard = (id: number) =>
  mockWards.find((ward) => ward.id === id) ?? null;

export const mockProjects: Project[] = [
  {
    id: 7001,
    name: "Riverfront Business Hub",
    slug: "riverfront-business-hub",
    categoryId: 202,
    developer: "An Bình Development",
    cityId: 1,
    districtId: 101,
    wardId: 1001,
    addressDetail: "Bến Nghé, Quận 1",
    longitude: 106.7009,
    latitude: 10.7767,
    area: 12000,
    price: 8500000000,
    content:
      "<h2>Tổng quan dự án</h2><p>Tổ hợp thương mại - văn phòng cao cấp, kết nối trực tiếp trục Nguyễn Huệ.</p>",
    viewCount: 920,
    status: "PUBLISHED",
    createdAt: "2026-03-12T03:00:00.000Z",
    updatedAt: "2026-05-12T03:00:00.000Z",
    category: getCategory(202),
    city: getCity(1),
    district: getDistrict(101),
    ward: getWard(1001),
  },
  {
    id: 7002,
    name: "Northgate Urban Zone",
    slug: "northgate-urban-zone",
    categoryId: 201,
    developer: "Sunland Group",
    cityId: 2,
    districtId: 202,
    wardId: 2002,
    addressDetail: "Cầu Giấy, Hà Nội",
    longitude: 105.7904,
    latitude: 21.0339,
    area: 48000,
    price: 14500000000,
    content:
      "<h2>Tiện ích</h2><p>Trung tâm thương mại, công viên nội khu, trường học liên cấp và bãi đỗ xe nổi.</p>",
    viewCount: 510,
    status: "PUBLISHED",
    createdAt: "2026-04-02T03:00:00.000Z",
    updatedAt: "2026-05-10T03:00:00.000Z",
    category: getCategory(201),
    city: getCity(2),
    district: getDistrict(202),
    ward: getWard(2002),
  },
  {
    id: 7003,
    name: "Marina Tech Complex",
    slug: "marina-tech-complex",
    categoryId: 202,
    developer: "Blue Coast Holdings",
    cityId: 3,
    districtId: 301,
    wardId: 3001,
    addressDetail: "Bạch Đằng, Hải Châu, Đà Nẵng",
    longitude: 108.2241,
    latitude: 16.0692,
    area: 26500,
    price: 9800000000,
    content:
      "<h2>Định hướng phát triển</h2><p>Tổ hợp văn phòng - thương mại ven sông, ưu tiên doanh nghiệp công nghệ và dịch vụ.</p>",
    viewCount: 640,
    status: "PUBLISHED",
    createdAt: "2026-04-18T04:20:00.000Z",
    updatedAt: "2026-05-11T06:10:00.000Z",
    category: getCategory(202),
    city: getCity(3),
    district: getDistrict(301),
    ward: getWard(3001),
  },
];

export const mockProjectImages: ProjectImage[] = [
  {
    id: 91001,
    projectId: 7001,
    fileUrl: "/imgs/wallpaper-1.jpg",
    publicId: "project-7001-1",
    sortOrder: 1,
    createdAt: "2026-03-12T03:00:00.000Z",
  },
  {
    id: 91002,
    projectId: 7001,
    fileUrl: "/imgs/wallpaper-3.jpg",
    publicId: "project-7001-2",
    sortOrder: 2,
    createdAt: "2026-03-12T03:00:00.000Z",
  },
  {
    id: 91003,
    projectId: 7001,
    fileUrl: "/imgs/wallpaper-5.jpg",
    publicId: "project-7001-3",
    sortOrder: 3,
    createdAt: "2026-03-12T03:00:00.000Z",
  },
  {
    id: 91004,
    projectId: 7002,
    fileUrl: "/imgs/wallpaper-2.jpg",
    publicId: "project-7002-1",
    sortOrder: 1,
    createdAt: "2026-04-02T03:00:00.000Z",
  },
  {
    id: 91005,
    projectId: 7002,
    fileUrl: "/imgs/wallpaper-4.jpg",
    publicId: "project-7002-2",
    sortOrder: 2,
    createdAt: "2026-04-02T03:00:00.000Z",
  },
  {
    id: 91006,
    projectId: 7002,
    fileUrl: "/imgs/wallpaper-6.jpg",
    publicId: "project-7002-3",
    sortOrder: 3,
    createdAt: "2026-04-02T03:00:00.000Z",
  },
  {
    id: 91007,
    projectId: 7003,
    fileUrl: "/imgs/wallpaper-6.jpg",
    publicId: "project-7003-1",
    sortOrder: 1,
    createdAt: "2026-04-18T04:20:00.000Z",
  },
  {
    id: 91008,
    projectId: 7003,
    fileUrl: "/imgs/wallpaper-5.jpg",
    publicId: "project-7003-2",
    sortOrder: 2,
    createdAt: "2026-04-18T04:20:00.000Z",
  },
  {
    id: 91009,
    projectId: 7003,
    fileUrl: "/imgs/wallpaper-3.jpg",
    publicId: "project-7003-3",
    sortOrder: 3,
    createdAt: "2026-04-18T04:20:00.000Z",
  },
];

export const getProjectGalleryImages = (projectId: number) =>
  mockProjectImages
    .filter((image) => image.projectId === projectId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => image.fileUrl);

export const getProjectThumbnailUrl = (projectId: number) =>
  getProjectGalleryImages(projectId)[0] || "/imgs/wallpaper-1.jpg";
