import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/common/Pagination";

describe("Pagination", () => {
  it("renders page buttons and emits page changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Pagination page={3} totalPages={5} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "4" }));

    expect(onChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole("button", { name: "3" })).toHaveClass(
      "border-primary",
    );
  });

  it("disables the previous button on the first page", () => {
    const onChange = jest.fn();

    render(<Pagination page={1} totalPages={2} onChange={onChange} />);

    expect(screen.getAllByRole("button")[0]).toBeDisabled();
  });
});
