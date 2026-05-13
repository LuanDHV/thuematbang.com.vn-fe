export const mockFilterPropertyTypes = [
  "Văn phòng",
  "Mặt bằng",
  "Kho xưởng",
  "Khu công nghiệp",
  "Căn hộ, chung cư",
  "Trung tâm thương mại",
  "Nhà trọ, phòng trọ",
];

export const mockFilterPriceOptions = [
  { label: "Tất cả khoảng giá", min: "", max: "" },
  { label: "Dưới 500 triệu", min: "0", max: "500000000" },
  { label: "500 - 800 triệu", min: "500000000", max: "800000000" },
  { label: "800 triệu - 1 tỷ", min: "800000000", max: "1000000000" },
  { label: "1 - 2 tỷ", min: "1000000000", max: "2000000000" },
  { label: "2 - 3 tỷ", min: "2000000000", max: "3000000000" },
  { label: "3 - 5 tỷ", min: "3000000000", max: "5000000000" },
  { label: "7 - 10 tỷ", min: "7000000000", max: "10000000000" },
  { label: "10 - 20 tỷ", min: "10000000000", max: "20000000000" },
  { label: "30 - 40 tỷ", min: "30000000000", max: "40000000000" },
  { label: "40 - 60 tỷ", min: "40000000000", max: "60000000000" },
  { label: "Thỏa thuận", min: "", max: "", isNegotiable: true },
];

export const mockFilterAreaOptions = [
  { label: "Tất cả diện tích", min: "", max: "" },
  { label: "Dưới 30 m²", min: "0", max: "30" },
  { label: "30 m² - 50 m²", min: "30", max: "50" },
  { label: "50 m² - 80 m²", min: "50", max: "80" },
  { label: "80 m² - 100 m²", min: "80", max: "100" },
  { label: "100 m² - 150 m²", min: "100", max: "150" },
  { label: "150 m² - 200 m²", min: "150", max: "200" },
  { label: "200 m² - 250 m²", min: "200", max: "250" },
  { label: "250 m² - 300 m²", min: "250", max: "300" },
  { label: "300 m² - 500 m²", min: "300", max: "500" },
  { label: "Trên 500 m²", min: "500", max: "" },
];
