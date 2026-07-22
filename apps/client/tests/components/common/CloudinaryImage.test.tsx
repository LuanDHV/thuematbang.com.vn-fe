import { fireEvent, render, screen } from "@testing-library/react";
import CloudinaryImage from "@/components/common/CloudinaryImage";

let lastImageProps: Record<string, unknown> | null = null;

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
    onError,
    unoptimized,
    ...props
  }: {
    src: string;
    alt: string;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
    unoptimized?: boolean;
  }) => {
    lastImageProps = { src, alt, onLoad, onError, unoptimized, ...props };
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} onLoad={onLoad} onError={onError} {...props} />
    );
  },
}));

describe("CloudinaryImage", () => {
  beforeEach(() => {
    lastImageProps = null;
  });

  it("shows a skeleton until the image has loaded", () => {
    render(
      <CloudinaryImage
        src="/imgs/fallback.webp"
        alt="Demo image"
        width={320}
        height={200}
      />,
    );

    expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();

    fireEvent.load(screen.getByRole("img", { name: "Demo image" }));

    expect(screen.queryByTestId("image-skeleton")).not.toBeInTheDocument();
  });

  it("disables Next optimization for Cloudinary sources", () => {
    render(
      <CloudinaryImage
        src="https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"
        alt="Cloudinary image"
        width={320}
        height={200}
      />,
    );

    expect(lastImageProps).not.toBeNull();
    expect(lastImageProps?.src).toBe(
      "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
    );
    expect(lastImageProps?.unoptimized).toBe(true);
  });

  it("switches to the fallback image when the source fails", () => {
    render(
      <CloudinaryImage
        src="https://res.cloudinary.com/demo/broken.jpg"
        fallbackSrc="/imgs/fallback.webp"
        alt="Fallback image"
        width={320}
        height={200}
      />,
    );

    const image = screen.getByRole("img", { name: "Fallback image" });

    fireEvent.error(image);

    expect(image).toHaveAttribute("src", "/imgs/fallback.webp");
    expect(lastImageProps?.src).toBe("/imgs/fallback.webp");
    expect(lastImageProps?.unoptimized).toBe(false);
    expect(screen.getByTestId("image-skeleton")).toBeInTheDocument();

    fireEvent.load(image);

    expect(screen.queryByTestId("image-skeleton")).not.toBeInTheDocument();
  });
});
