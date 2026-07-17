import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

import ProfileCompletionGate from "@/components/auth/ProfileCompletionGate";
import type { User } from "@/types";
import { renderWithProviders } from "../../test-utils/render";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const updateMutateAsyncMock = jest.fn();
const logoutMutateAsyncMock = jest.fn();

let authUserMock: User | null = null;
let updateMutationState: {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
} = {
  isPending: false,
  isError: false,
  error: null,
};
let logoutMutationState: {
  isPending: boolean;
} = {
  isPending: false,
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("@/components/ui/dialog", () => {
  const React = require("react");

  return {
    Dialog: ({ children, open }: { children: React.ReactNode; open?: boolean }) =>
      open ? <div>{children}</div> : null,
    DialogContent: ({
      children,
    }: {
      children: React.ReactNode;
      showCloseButton?: boolean;
    }) => <div role="dialog">{children}</div>,
    DialogDescription: ({ children }: { children: React.ReactNode }) => (
      <p>{children}</p>
    ),
    DialogFooter: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogHeader: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: React.ReactNode }) => (
      <h2>{children}</h2>
    ),
  };
});

jest.mock("@/hooks/use-auth", () => ({
  useAuthMe: () => ({
    data: authUserMock,
  }),
  useLogoutMutation: () => ({
    mutateAsync: logoutMutateAsyncMock,
    ...logoutMutationState,
  }),
}));

jest.mock("@/hooks/use-user-management", () => ({
  useUpdateMyProfileMutation: () => ({
    mutateAsync: updateMutateAsyncMock,
    ...updateMutationState,
  }),
}));

function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    fullName: "Nguyen Van A",
    email: "user@example.com",
    phone: null,
    phoneNormalized: null,
    googleId: "google-id",
    avatarUrl: null,
    avatarPublicId: null,
    authProvider: "GOOGLE",
    role: "CUSTOMER",
    createdAt: "2026-07-17T00:00:00.000Z",
    updatedAt: "2026-07-17T00:00:00.000Z",
    ...overrides,
  };
}

describe("ProfileCompletionGate", () => {
  beforeEach(() => {
    authUserMock = null;
    updateMutationState = {
      isPending: false,
      isError: false,
      error: null,
    };
    logoutMutationState = {
      isPending: false,
    };
    pushMock.mockReset();
    refreshMock.mockReset();
    updateMutateAsyncMock.mockReset();
    logoutMutateAsyncMock.mockReset();
  });

  it("shows the required phone dialog for Google users without phone", () => {
    authUserMock = createUser();

    renderWithProviders(<ProfileCompletionGate />);

    expect(screen.getByText("Bổ sung số điện thoại")).toBeInTheDocument();
    expect(screen.getByLabelText("Số điện thoại")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Lưu số điện thoại" }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog when the user already has phone", () => {
    authUserMock = createUser({
      phone: "0901234567",
      phoneNormalized: "84901234567",
    });

    renderWithProviders(<ProfileCompletionGate />);

    expect(screen.queryByText("Bổ sung số điện thoại")).not.toBeInTheDocument();
  });

  it("does not show the dialog for non-Google users", () => {
    authUserMock = createUser({
      authProvider: "LOCAL",
      googleId: null,
    });

    renderWithProviders(<ProfileCompletionGate />);

    expect(screen.queryByText("Bổ sung số điện thoại")).not.toBeInTheDocument();
  });

  it("submits a valid phone and refreshes the route", async () => {
    const user = userEvent.setup();
    authUserMock = createUser({
      avatarUrl: "https://example.com/avatar.jpg",
      avatarPublicId: "users/1/avatar",
    });
    updateMutateAsyncMock.mockResolvedValue(createUser({ phone: "0901234567" }));

    renderWithProviders(<ProfileCompletionGate />);

    await user.type(screen.getByLabelText("Số điện thoại"), "0901234567");
    await user.click(screen.getByRole("button", { name: "Lưu số điện thoại" }));

    await waitFor(() => {
      expect(updateMutateAsyncMock).toHaveBeenCalledWith({
        fullName: "Nguyen Van A",
        email: "user@example.com",
        phone: "0901234567",
        avatarUrl: "https://example.com/avatar.jpg",
        avatarPublicId: "users/1/avatar",
      });
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("keeps the dialog open and shows mutation errors", () => {
    authUserMock = createUser();
    updateMutationState = {
      isPending: false,
      isError: true,
      error: new Error("Account information already exists"),
    };

    renderWithProviders(<ProfileCompletionGate />);

    expect(screen.getByText("Bổ sung số điện thoại")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Không thể cập nhật số điện thoại. Số điện thoại có thể đã được sử dụng hoặc không hợp lệ.",
      ),
    ).toBeInTheDocument();
  });

  it("logs out and redirects home when the secondary action is clicked", async () => {
    const user = userEvent.setup();
    authUserMock = createUser();
    logoutMutateAsyncMock.mockResolvedValue({ ok: true });

    renderWithProviders(<ProfileCompletionGate />);

    await user.click(screen.getByRole("button", { name: "Đăng xuất" }));

    await waitFor(() => {
      expect(logoutMutateAsyncMock).toHaveBeenCalledTimes(1);
    });
    expect(refreshMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
