import { render, screen } from "@testing-library/react";
import { ImageSkeleton, ListingPageSkeleton } from "@/components/common/Skeleton";

describe("Skeleton components", () => {
  it("renders an image skeleton placeholder", () => {
    render(
      <div className="relative h-20 w-20">
        <ImageSkeleton />
      </div>,
    );

    expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();
  });

  it("renders listing skeleton layouts", () => {
    render(<ListingPageSkeleton variant="property" count={3} />);

    expect(screen.getByTestId("listing-page-skeleton")).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
