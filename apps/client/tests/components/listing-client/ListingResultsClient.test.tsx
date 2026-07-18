import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import ListingResultsClient from "@/components/listing-client/ListingResultsClient";

const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}));

jest.mock("@/components/common/DynamicBreadcrumb", () => ({
  __esModule: true,
  default: () => <nav aria-label="breadcrumb" />,
}));

jest.mock("@/components/common/PropertyCard", () => ({
  PropertyCard: ({ property }: { property: { id: number } }) => (
    <article>Property {property.id}</article>
  ),
}));

jest.mock("@/components/common/RentRequestCard", () => ({
  RentRequestCard: ({ request }: { request: { id: number } }) => (
    <article>Rent request {request.id}</article>
  ),
}));

jest.mock("@/components/common/Title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

describe("ListingResultsClient pagination navigation", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
  });

  it("pushes a history entry when navigating to page 2", async () => {
    const user = userEvent.setup();

    render(
      <ListingResultsClient
        properties={[{ id: 1, priorityStatus: "FREE" } as never]}
        paginationBasePath="/cho-thue"
        paginationMeta={{
          currentPage: 1,
          totalPage: 3,
          total: 72,
          limit: 24,
          hasNextPage: true,
          hasPreviousPage: false,
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "2" }));

    expect(pushMock).toHaveBeenCalledWith("/cho-thue/p2");
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("keeps page 1 canonical when navigating back through pagination", async () => {
    const user = userEvent.setup();

    render(
      <ListingResultsClient
        properties={[{ id: 1, priorityStatus: "FREE" } as never]}
        paginationBasePath="/cho-thue"
        paginationMeta={{
          currentPage: 2,
          totalPage: 3,
          total: 72,
          limit: 24,
          hasNextPage: true,
          hasPreviousPage: true,
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "1" }));

    expect(pushMock).toHaveBeenCalledWith("/cho-thue");
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
