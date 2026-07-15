import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import AdminPropertiesTable from "@/components/cms/admin/AdminPropertiesTable";
import type { Property } from "@/types/property";

const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => "/admin/quan-li-tin-dang/cho-thue",
  useSearchParams: () => ({
    toString: () => "page=1",
  }),
}));

jest.mock("@/actions/property.actions", () => ({
  deletePropertyAction: jest.fn(),
}));

describe("AdminPropertiesTable", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
  });

  const baseProperty: Property = {
    id: 1,
    title: "Nhà mặt phố Nguyễn Huệ",
    slug: "nha-mat-pho-nguyen-hue",
    displayCode: "TMB-000001",
    categoryId: 1,
    price: 5000000000,
    priceAmount: 5,
    priceUnit: "BILLION",
    isNegotiable: false,
    area: 80,
    direction: "DONG",
    bedrooms: 3,
    bathrooms: 2,
    floors: 4,
    priorityStatus: "FREE",
    publishSource: "FREE_QUOTA",
    isBoosted: false,
    boostCount: 0,
    provinceId: 1,
    wardId: 1,
    addressDetail: "Quận 1",
    contactName: "Nguyễn Văn A",
    contactPhone: "0901234567",
    viewCount: 100,
    favoriteCount: 0,
    status: "PUBLISHED",
    createdAt: "2026-06-22T00:00:00.000Z",
    updatedAt: "2026-06-22T00:00:00.000Z",
    category: { id: 1, type: "PROPERTY", name: "Căn hộ", slug: "can-ho", priority: 0, isActive: true, createdAt: "2026-06-22T00:00:00.000Z", updatedAt: "2026-06-22T00:00:00.000Z" },
    province: { id: 1, name: "TP. Hồ Chí Minh", slug: "tp-ho-chi-minh" },
    ward: { id: 1, name: "Phường Bến Nghé", slug: "phuong-ben-nghe", provinceId: 1 },
  };

  it("renders column headers including Phù hợp and Diện tích", () => {
    render(
      <AdminPropertiesTable
        properties={[baseProperty]}
        currentPage={1}
        totalPages={1}
      />,
    );

    expect(screen.getAllByText("Phù hợp").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Diện tích").length).toBeGreaterThanOrEqual(1);
  });

  it("shows Phù hợp badge for matched property", () => {
    const properties: Property[] = [{ ...baseProperty, isMatched: true }];
    render(
      <AdminPropertiesTable
        properties={properties}
        currentPage={1}
        totalPages={1}
      />,
    );

    const badges = screen.getAllByText("Phù hợp");
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });

  it("shows Chưa phù hợp badge for unmatched property", () => {
    const properties: Property[] = [{ ...baseProperty, isMatched: false }];
    render(
      <AdminPropertiesTable
        properties={properties}
        currentPage={1}
        totalPages={1}
      />,
    );

    expect(screen.getAllByText("Chưa phù hợp").length).toBeGreaterThanOrEqual(1);
  });

  it("renders area value 80m²", () => {
    render(
      <AdminPropertiesTable
        properties={[baseProperty]}
        currentPage={1}
        totalPages={1}
      />,
    );

    expect(screen.getAllByText("80m²").length).toBeGreaterThanOrEqual(1);
  });
});
