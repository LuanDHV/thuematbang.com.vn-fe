import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FavoriteButton from "@/components/common/FavoriteButton";
import { favoriteClient } from "@/lib/favorites/favorite-client";

const pushMock = jest.fn();
const setQueryDataMock = jest.fn();
const invalidateQueriesMock = jest.fn();
const useQueryMock = jest.fn();
const useAuthMeMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
  useQueryClient: () => ({
    setQueryData: setQueryDataMock,
    invalidateQueries: invalidateQueriesMock,
  }),
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuthMe: () => useAuthMeMock(),
}));

jest.mock("@/lib/favorites/favorite-client", () => ({
  favoriteClient: {
    getState: jest.fn(),
    toggle: jest.fn(),
  },
}));

describe("FavoriteButton", () => {
  beforeEach(() => {
    pushMock.mockReset();
    setQueryDataMock.mockReset();
    invalidateQueriesMock.mockReset();
    useQueryMock.mockReset();
    useAuthMeMock.mockReset();
    window.localStorage.clear();
    window.history.pushState({}, "", "/cho-thue/can-ho-a");
  });

  it("redirects unauthenticated users to login with the return url", () => {
    useAuthMeMock.mockReturnValue({ data: null });
    useQueryMock.mockReturnValue({ data: undefined });

    render(
      <FavoriteButton
        entityType="PROPERTY"
        entityId={11}
        initialFavoriteCount={7}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Quan tâm" }));

    expect(pushMock).toHaveBeenCalledWith(
      "/dang-nhap?from=%2Fcho-thue%2Fcan-ho-a",
    );
    expect(favoriteClient.toggle).not.toHaveBeenCalled();
  });

  it("toggles the favorite state optimistically for authenticated users", async () => {
    const onToggleResult = jest.fn();
    useAuthMeMock.mockReturnValue({ data: { id: 1 } });
    useQueryMock.mockReturnValue({
      data: { isFavorited: false, favoriteCount: 4 },
    });
    (favoriteClient.toggle as jest.Mock).mockResolvedValue({
      isFavorited: true,
      favoriteCount: 6,
    });

    render(
      <FavoriteButton
        entityType="PROPERTY"
        entityId={11}
        initialFavoriteCount={4}
        onToggleResult={onToggleResult}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Quan tâm" }));
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();

    await waitFor(() => {
      expect(favoriteClient.toggle).toHaveBeenCalledWith({
        entityType: "PROPERTY",
        entityId: 11,
      });
    });

    expect(setQueryDataMock).toHaveBeenCalledWith(
      ["favorite-state", "PROPERTY", 11],
      { isFavorited: true, favoriteCount: 6 },
    );
    expect(invalidateQueriesMock).toHaveBeenCalled();
    expect(onToggleResult).toHaveBeenLastCalledWith(true, 6);
  });
});
