import { City, District, Street, Ward } from "../src/types/location";

export const mockCities: City[] = [
  { id: 1, name: "TP. Hồ Chí Minh", slug: "tp-ho-chi-minh" },
  { id: 2, name: "Hà Nội", slug: "ha-noi" },
  { id: 3, name: "Đà Nẵng", slug: "da-nang" },
];

export const mockDistricts: District[] = [
  { id: 101, cityId: 1, name: "Quận 1", slug: "quan-1" },
  { id: 102, cityId: 1, name: "Quận 7", slug: "quan-7" },
  { id: 201, cityId: 2, name: "Ba Đình", slug: "ba-dinh" },
  { id: 202, cityId: 2, name: "Cầu Giấy", slug: "cau-giay" },
  { id: 301, cityId: 3, name: "Hải Châu", slug: "hai-chau" },
];

export const mockWards: Ward[] = [
  { id: 1001, cityId: 1, districtId: 101, name: "Bến Nghé", slug: "ben-nghe" },
  { id: 1002, cityId: 1, districtId: 102, name: "Tân Phú", slug: "tan-phu-q7" },
  { id: 2001, cityId: 2, districtId: 201, name: "Cống Vị", slug: "cong-vi" },
  { id: 2002, cityId: 2, districtId: 202, name: "Dịch Vọng", slug: "dich-vong" },
  { id: 3001, cityId: 3, districtId: 301, name: "Hải Châu 1", slug: "hai-chau-1" },
];

export const mockStreets: Street[] = [
  {
    id: 5001,
    cityId: 1,
    districtId: 101,
    wardId: 1001,
    name: "Nguyễn Huệ",
    slug: "nguyen-hue",
  },
  {
    id: 5002,
    cityId: 1,
    districtId: 102,
    wardId: 1002,
    name: "Nguyễn Lương Bằng",
    slug: "nguyen-luong-bang",
  },
  {
    id: 5003,
    cityId: 2,
    districtId: 201,
    wardId: 2001,
    name: "Đội Cấn",
    slug: "doi-can",
  },
  {
    id: 5004,
    cityId: 2,
    districtId: 202,
    wardId: 2002,
    name: "Trần Thái Tông",
    slug: "tran-thai-tong",
  },
  {
    id: 5005,
    cityId: 3,
    districtId: 301,
    wardId: 3001,
    name: "Bạch Đằng",
    slug: "bach-dang",
  },
];
