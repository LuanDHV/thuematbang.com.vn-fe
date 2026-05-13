import { Project } from "../src/types/project";
import { mockCategoryProject } from "./categories";
import { mockCities, mockDistricts, mockWards } from "./locations";

const getCategory = (id: number) =>
  mockCategoryProject.find((category) => category.id === id) ?? null;
const getCity = (id: number) => mockCities.find((city) => city.id === id) ?? null;
const getDistrict = (id: number) =>
  mockDistricts.find((district) => district.id === id) ?? null;
const getWard = (id: number) => mockWards.find((ward) => ward.id === id) ?? null;

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
    area: 12000,
    price: 8500000000,
    thumbnailUrl: "/imgs/wallpaper-1.jpg",
    content: "<h2>Tổng quan dự án</h2><p>Tổ hợp thương mại - văn phòng cao cấp.</p>",
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
    area: 48000,
    price: 14500000000,
    thumbnailUrl: "/imgs/wallpaper-2.jpg",
    content: "<h2>Tiện ích</h2><p>Trung tâm thương mại, công viên, trường học.</p>",
    viewCount: 510,
    status: "PUBLISHED",
    createdAt: "2026-04-02T03:00:00.000Z",
    updatedAt: "2026-05-10T03:00:00.000Z",
    category: getCategory(201),
    city: getCity(2),
    district: getDistrict(202),
    ward: getWard(2002),
  },
];
