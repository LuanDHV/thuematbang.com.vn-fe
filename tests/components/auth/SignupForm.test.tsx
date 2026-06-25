import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/render";
import { SignupForm } from "@/components/auth/SignupForm";

const pushMock = jest.fn();
const refreshMock = jest.fn();
const mutateAsyncMock = jest.fn();
let registerErrorMock: Error | null = null;

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("@/hooks/use-auth", () => {
  return {
    useRegisterMutation: () => ({
      mutateAsync: mutateAsyncMock,
      isPending: false,
      error: registerErrorMock,
    }),
  };
});

describe("SignupForm", () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    mutateAsyncMock.mockReset();
    registerErrorMock = null;
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SignupForm />);

    await user.click(screen.getByRole("button", { name: "Đăng ký" }));

    expect(await screen.findByText("Vui lòng nhập họ và tên hợp lệ")).toBeInTheDocument();
    expect(await screen.findByText("Định dạng email không hợp lệ")).toBeInTheDocument();
    expect(
      await screen.findByText("Số điện thoại không hợp lệ"),
    ).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("submits valid data and returns to the homepage", async () => {
    const user = userEvent.setup();
    mutateAsyncMock.mockResolvedValue({ ok: true });

    renderWithProviders(<SignupForm />);

    await user.type(screen.getByLabelText("Họ và tên"), "Nguyễn Văn A");
    await user.type(screen.getByLabelText("Email"), "a@example.com");
    await user.type(screen.getByLabelText("Số điện thoại"), "0901234567");
    await user.type(screen.getByLabelText("Mật khẩu"), "Abcd1234!");
    await user.type(
      screen.getByLabelText("Xác nhận mật khẩu"),
      "Abcd1234!",
    );
    await user.click(screen.getByRole("button", { name: "Đăng ký" }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        fullName: "Nguyễn Văn A",
        email: "a@example.com",
        phone: "0901234567",
        password: "Abcd1234!",
        confirmPassword: "Abcd1234!",
      });
    });

    expect(pushMock).toHaveBeenCalledWith("/");
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it("maps duplicate server errors into friendly messages", async () => {
    registerErrorMock = new Error("email and phone already exist");

    renderWithProviders(<SignupForm />);

    expect(
      screen.getByText("Email và số điện thoại đã được sử dụng."),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });
});
