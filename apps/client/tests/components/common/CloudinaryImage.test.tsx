import { fireEvent, render, screen } from "@testing-library/react";
import CloudinaryImage from "@/components/common/CloudinaryImage";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
    onError,
    ...props
  }: {
    src: string;
    alt: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onLoad={onLoad} onError={onError} {...props} />
  ),
}));

describe("CloudinaryImage", () => {
  it("shows a skeleton until the image has loaded", () => {
    render(
      <CloudinaryImage
        src="/imgs/fallback.png"
        alt="Demo image"
        width={320}
        height={200}
      />,
    );

    expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { name: "Demo image" }));

    expect(screen.queryByTestId("image-skeleton")).not.toBeInTheDocument();
  });

  it("switches to the fallback image when the source fails", () => {
    render(
      <CloudinaryImage
        src="https://res.cloudinary.com/demo/broken.jpg"
        fallbackSrc="/imgs/fallback.png"
        alt="Fallback image"
        width={320}
        height={200}
      />,
    );

    const image = screen.getByRole("img", { name: "Fallback image" });

    fireEvent.error(image);

    expect(image).toHaveAttribute("src", "/imgs/fallback.png");
    expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();

    fireEvent.load(image);

    expect(screen.queryByTestId("image-skeleton")).not.toBeInTheDocument();
  });
});
