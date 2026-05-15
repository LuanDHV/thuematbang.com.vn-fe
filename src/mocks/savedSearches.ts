import { SavedSearch } from "../types/saved-search";

export const mockSavedSearches: SavedSearch[] = [
  {
    id: 1,
    userId: 1,
    name: "Mặt bằng Q1 dưới 50 triệu",
    targetType: "PROPERTY",
    criteria: {
      categoryIds: [101],
      cityId: 1,
      districtId: 101,
      maxPrice: 50000000,
    },
    isDefault: true,
    createdAt: "2026-05-10T06:00:00.000Z",
    updatedAt: "2026-05-10T06:00:00.000Z",
  },
  {
    id: 2,
    userId: 1,
    name: "Văn phòng Đà Nẵng 50-100m2",
    targetType: "RENT_REQUEST",
    criteria: {
      categoryIds: [102],
      cityId: 3,
      minArea: 50,
      maxArea: 100,
    },
    isDefault: false,
    createdAt: "2026-05-11T06:00:00.000Z",
    updatedAt: "2026-05-11T06:00:00.000Z",
  },
];
