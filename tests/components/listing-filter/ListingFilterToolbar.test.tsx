import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/render";
import ListingFilterToolbar from "@/components/listing-filter/ListingFilterToolbar";
import { INITIAL_ADVANCED_FILTER_VALUE } from "@/types/filter";

const replaceMock = jest.fn();
const getProvincesActionMock = jest.fn();
const getProvinceWardsActionMock = jest.fn();
const getPublicSearchSuggestionsActionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

jest.mock("@/actions/location.actions", () => ({
  getProvincesAction: (...args: unknown[]) => getProvincesActionMock(...args),
  getProvinceWardsAction: (...args: unknown[]) =>
    getProvinceWardsActionMock(...args),
}));

jest.mock("@/actions/public-search.actions", () => ({
  getPublicSearchSuggestionsAction: (...args: unknown[]) =>
    getPublicSearchSuggestionsActionMock(...args),
}));

describe("ListingFilterToolbar", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    getProvincesActionMock.mockReset();
    getProvinceWardsActionMock.mockReset();
    getPublicSearchSuggestionsActionMock.mockReset();

    getProvincesActionMock.mockResolvedValue([]);
    getProvinceWardsActionMock.mockResolvedValue([]);
  });

  it("navigates to the first search suggestion after typing a keyword", async () => {
    const user = userEvent.setup();

    getPublicSearchSuggestionsActionMock.mockResolvedValue([
      {
        label: "Căn hộ Quận 1",
        targetResource: "property",
        flatSlug: "can-ho-quan-1",
      },
    ]);

    renderWithProviders(<ListingFilterToolbar basePath="/cho-thue" />);

    await user.type(
      screen.getByPlaceholderText("Bạn muốn thuê ở đâu?"),
      "can",
    );

    await waitFor(() => {
      expect(getPublicSearchSuggestionsActionMock).toHaveBeenCalled();
    });

    const suggestion = await screen.findByRole("button", {
      name: "Căn hộ Quận 1",
    });

    await user.click(suggestion);

    expect(replaceMock).toHaveBeenCalledWith("/cho-thue/can-ho-quan-1", {
      scroll: false,
    });
  });

  it("opens the advanced filter drawer from the trigger button", async () => {
    const user = userEvent.setup();
    const initialFilters = {
      ...INITIAL_ADVANCED_FILTER_VALUE,
      propertyTypes: ["Chung cư"],
    };

    renderWithProviders(
      <ListingFilterToolbar
        basePath="/cho-thue"
        initialFilters={initialFilters}
      />,
    );

    await user.click(screen.getByText("1").closest("button") as HTMLButtonElement);

    expect(screen.getByText("Bộ lọc nâng cao")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đặt lại" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Xem kết quả" }),
    ).toBeInTheDocument();
  });
});
