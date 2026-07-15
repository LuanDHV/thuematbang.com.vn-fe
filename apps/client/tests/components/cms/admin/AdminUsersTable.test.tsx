import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import AdminUsersTable from "@/components/cms/admin/AdminUsersTable";
import type { User } from "@/types/user";
import { within } from "@testing-library/react";

const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => "/admin/quan-li-tai-khoan",
  useSearchParams: () => ({
    toString: () => "page=2",
  }),
}));

describe("AdminUsersTable", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
  });

  it("renders admin table content, search field, and row action link", () => {
    const users: User[] = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        email: "a@example.com",
        phone: "0901234567",
        role: "ADMIN",
        authProvider: "LOCAL",
        createdAt: "2026-06-22T00:00:00.000Z",
        updatedAt: "2026-06-22T00:00:00.000Z",
      },
    ];

    render(
      <AdminUsersTable
        users={users}
        currentPage={2}
        totalPages={5}
        totalItems={1}
        toolbar={{
          title: "Quản lý tài khoản",
          searchPlaceholder: "Tìm theo tên",
          actionLabel: "Thêm tài khoản",
          actionHref: "/admin/quan-li-tai-khoan/new",
        }}
      />,
    );

    expect(screen.getByText("Quản lý tài khoản")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Tìm theo tên"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Thêm tài khoản" }),
    ).toHaveAttribute("href", "/admin/quan-li-tai-khoan/new");
    expect(
      within(screen.getByRole("table")).getAllByText("Nguyễn Văn A"),
    ).toHaveLength(1);
    expect(
      screen.getAllByRole("button", { name: "Tác vụ cho bản ghi 1" }),
    ).toHaveLength(2);
  });
});
