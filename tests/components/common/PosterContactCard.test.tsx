import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";

import PosterContactCard from "@/components/common/PosterContactCard";
import { renderWithProviders } from "../../test-utils/render";

const createPublicLeadActionMock = jest.fn();
const useAuthMeMock = jest.fn();

jest.mock("@/actions/lead.actions", () => ({
  createPublicLeadAction: (...args: unknown[]) =>
    createPublicLeadActionMock(...args),
}));

jest.mock("@/hooks/use-auth", () => ({
  useAuthMe: (...args: unknown[]) => useAuthMeMock(...args),
}));

describe("PosterContactCard", () => {
  beforeEach(() => {
    createPublicLeadActionMock.mockReset();
    useAuthMeMock.mockReset();
  });

  it("lets a guest submit contact info and shows the success popup", async () => {
    const user = userEvent.setup();

    useAuthMeMock.mockReturnValue({ data: null });
    createPublicLeadActionMock.mockResolvedValue({
      id: 1,
      fullName: "Nguyen Van A",
      phone: "0901234567",
    });

    renderWithProviders(
      <PosterContactCard fullName="Chu tin" propertyId={12} />,
    );

    await user.click(screen.getByRole("button", { name: "Liên hệ" }));

    await user.type(screen.getByLabelText("Họ và tên"), "Nguyen Van A");
    await user.type(screen.getByLabelText("Số điện thoại"), "0901234567");
    await user.click(screen.getByRole("button", { name: "Gửi liên hệ" }));

    await waitFor(() => {
      expect(createPublicLeadActionMock).toHaveBeenCalledWith({
        fullName: "Nguyen Van A",
        phone: "0901234567",
        propertyId: 12,
        rentRequestId: null,
      });
    });

    expect(await screen.findByText("Đã nhận thông tin")).toBeInTheDocument();
    expect(
      await screen.findByText(/Chúng tôi đã nhận được thông tin và sẽ liên hệ lại qua số điện thoại/i),
    ).toBeInTheDocument();
    expect(screen.getByText("0901234567")).toBeInTheDocument();
  });

  it("prefills the logged-in user's information before submitting", async () => {
    const user = userEvent.setup();

    useAuthMeMock.mockReturnValue({
      data: {
        id: 7,
        fullName: "User Logged",
        phone: "0905555666",
      },
    });
    createPublicLeadActionMock.mockResolvedValue({
      id: 2,
      fullName: "User Logged",
      phone: "0905555666",
    });

    renderWithProviders(<PosterContactCard fullName="Chu tin" />);

    await user.click(screen.getByRole("button", { name: "Liên hệ" }));

    expect(screen.getByDisplayValue("User Logged")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0905555666")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Gửi liên hệ" }));

    await waitFor(() => {
      expect(createPublicLeadActionMock).toHaveBeenCalledWith({
        fullName: "User Logged",
        phone: "0905555666",
        propertyId: null,
        rentRequestId: null,
      });
    });

    expect(screen.getByText("0905555666")).toBeInTheDocument();
  });

  it("sends the rent request id when the card is rendered for a rent request", async () => {
    const user = userEvent.setup();

    useAuthMeMock.mockReturnValue({ data: null });
    createPublicLeadActionMock.mockResolvedValue({
      id: 3,
      fullName: "Guest Lead",
      phone: "0907777888",
    });

    renderWithProviders(
      <PosterContactCard fullName="Chu tin" rentRequestId={88} />,
    );

    await user.click(screen.getByRole("button", { name: "Liên hệ" }));
    await user.type(screen.getByLabelText("Họ và tên"), "Guest Lead");
    await user.type(screen.getByLabelText("Số điện thoại"), "0907777888");
    await user.click(screen.getByRole("button", { name: "Gửi liên hệ" }));

    await waitFor(() => {
      expect(createPublicLeadActionMock).toHaveBeenCalledWith({
        fullName: "Guest Lead",
        phone: "0907777888",
        propertyId: null,
        rentRequestId: 88,
      });
    });
  });
});
