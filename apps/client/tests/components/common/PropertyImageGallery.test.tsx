import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";
import PropertyImageGallery from "@/components/common/PropertyImageGallery";

jest.mock("@/components/common/CloudinaryImage", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
    className,
  }: {
    alt?: string;
    src: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} src={src} className={className} />
  ),
}));

jest.mock("@/lib/analytics/track-event", () => ({
  sanitizeAnalyticsText: (value?: string | null) => value ?? undefined,
  trackEvent: jest.fn(),
}));

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

jest.mock("yet-another-react-lightbox", () => ({
  __esModule: true,
  default: ({ open, close }: { open: boolean; close: () => void }) =>
    open ? (
      <div role="dialog" aria-label="image lightbox">
        <button type="button" onClick={close}>
          Close lightbox
        </button>
      </div>
    ) : null,
}));

jest.mock("yet-another-react-lightbox/plugins/counter", () => ({}));
jest.mock("yet-another-react-lightbox/plugins/fullscreen", () => ({}));
jest.mock("yet-another-react-lightbox/plugins/thumbnails", () => ({}));
jest.mock("yet-another-react-lightbox/plugins/zoom", () => ({}));

describe("PropertyImageGallery browser history", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/cho-thue/demo-listing");
  });

  it("pushes a same-page history entry when opening the lightbox", async () => {
    const user = userEvent.setup();
    const pushStateSpy = jest.spyOn(window.history, "pushState");

    render(
      <PropertyImageGallery
        title="Demo listing"
        images={["/imgs/fallback.png"]}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mở trình xem ảnh của Demo listing",
      }),
    );

    expect(screen.getByRole("dialog", { name: "image lightbox" })).toBeVisible();
    expect(pushStateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ __thuematbangGalleryOpen: true }),
      "",
      window.location.href,
    );
  });

  it("closes the lightbox on browser back without changing pages", async () => {
    const user = userEvent.setup();

    render(
      <PropertyImageGallery
        title="Demo listing"
        images={["/imgs/fallback.png"]}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mở trình xem ảnh của Demo listing",
      }),
    );

    expect(screen.getByRole("dialog", { name: "image lightbox" })).toBeVisible();

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
    });

    expect(
      screen.queryByRole("dialog", { name: "image lightbox" }),
    ).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/cho-thue/demo-listing");
  });

  it("uses browser back when closing from the lightbox UI", async () => {
    const user = userEvent.setup();
    const backSpy = jest.spyOn(window.history, "back").mockImplementation();

    render(
      <PropertyImageGallery
        title="Demo listing"
        images={["/imgs/fallback.png"]}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Mở trình xem ảnh của Demo listing",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Close lightbox" }));

    expect(backSpy).toHaveBeenCalledTimes(1);
  });
});
