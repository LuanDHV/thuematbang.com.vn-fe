import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import PasswordInput from "@/components/common/PasswordInput";

describe("PasswordInput", () => {
  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(<PasswordInput placeholder="Password" />);

    const input = screen.getByPlaceholderText("Password");
    const toggle = screen.getByRole("button");

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
