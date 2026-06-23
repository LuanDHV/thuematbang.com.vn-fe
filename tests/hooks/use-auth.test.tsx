import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { createTestQueryClient } from "../test-utils/query-client";
import { AUTH_ME_QUERY_KEY, useLogoutMutation } from "@/hooks/use-auth";

const mockLogout = jest.fn();

jest.mock("@/services/auth.service", () => ({
  authService: {
    logout: (...args: unknown[]) => mockLogout(...args),
  },
}));

jest.mock("@/actions/user.actions", () => ({
  getCurrentUserAction: jest.fn(),
}));

function createWrapper() {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { Wrapper, queryClient };
}

describe("useAuth hooks", () => {
  beforeEach(() => {
    mockLogout.mockResolvedValue({ message: "logged out" });
  });

  it("logout mutation clears cached auth state after settling", async () => {
    const { Wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, { id: 1 });

    const { result } = renderHook(() => useLogoutMutation(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(AUTH_ME_QUERY_KEY)).toBeNull();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
