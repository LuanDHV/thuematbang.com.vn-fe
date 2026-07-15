import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/render";
import { LoginForm } from "@/components/auth/LoginForm";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const mutateAsyncMock = jest.fn();
const getCurrentUserActionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("@/hooks/use-auth", () => {
  return {
    AUTH_ME_QUERY_KEY: ["auth", "me"],
    useLoginMutation: () => ({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: null,
    }),
  };
});

jest.mock("@/actions/user.actions", () => ({
  getCurrentUserAction: (...args: unknown[]) => getCurrentUserActionMock(...args),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    mutateAsyncMock.mockReset();
    getCurrentUserActionMock.mockReset();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    expect(
      await screen.findByText("Vui lòng nhập email hoặc số điện thoại"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("submits valid credentials and redirects to the provided path", async () => {
    const user = userEvent.setup();
    getCurrentUserActionMock.mockResolvedValue({ role: "CUSTOMER" });
    mutateAsyncMock.mockResolvedValue({ ok: true });

    renderWithProviders(
      <LoginForm redirectTo="/tin-cua-toi" />,
    );

    await user.type(
      screen.getByLabelText("Số điện thoại hoặc email"),
      "0901234567",
    );
    await user.type(screen.getByLabelText("Mật khẩu"), "Abcd1234!");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        identifier: "0901234567",
        password: "Abcd1234!",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/tin-cua-toi");
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("sends non-admin users back home when the admin variant is used", async () => {
    const user = userEvent.setup();
    getCurrentUserActionMock.mockResolvedValue({ role: "CUSTOMER" });
    mutateAsyncMock.mockResolvedValue({ ok: true });

    renderWithProviders(<LoginForm variant="admin" />);

    await user.type(
      screen.getByLabelText("Số điện thoại hoặc email"),
      "0901234567",
    );
    await user.type(screen.getByLabelText("Mật khẩu"), "Abcd1234!");
    await user.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });

    expect(refreshMock).toHaveBeenCalledTimes(1);
  });
});
