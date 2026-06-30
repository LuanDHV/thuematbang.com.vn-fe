const pushMock = jest.fn();
const refreshMock = jest.fn();
const toastMock = jest.fn();
const submitActionMock = jest.fn();

let authMeResult = {
  data: {
    id: 1,
    fullName: "Test Customer",
    phone: "0901234567",
    email: "customer@example.com",
    role: "CUSTOMER",
  },
  isLoading: false,
};

jest.mock("next/server", () => ({
  NextResponse: { json: jest.fn() },
  NextRequest: jest.fn(),
}));

jest.mock("@/components/ui/use-toast", () => ({
  useToast: () => ({ toast: toastMock }),
}));

jest.mock("@/hooks/use-auth", () => ({
  AUTH_ME_QUERY_KEY: ["auth", "me"],
  useAuthMe: () => authMeResult,
}));

jest.mock("@/lib/cloudinary-upload", () => ({
  uploadCloudinaryImagesSettled: jest.fn(() => Promise.resolve([])),
  deleteCloudinaryImages: jest.fn(() => Promise.resolve(undefined)),
}));

jest.mock("@/actions/location.actions", () => ({
  getProvinceWardsAction: jest.fn(() =>
    Promise.resolve([{ id: 1, name: "Quận 1" }]),
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: function ImageMock(props: Record<string, unknown>) {
      const { alt, fill, priority, sizes, unoptimized, ...rest } = props;
      return React.createElement("img", { alt: String(alt ?? ""), ...rest });
    },
  };
});

import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/render";
import { PropertyCreateForm } from "@/components/listing-form/PropertyCreateForm";

const basicCategories = [
  { id: 1, name: "Mặt bằng", slug: "mat-bang", type: "PROPERTY" },
];
const basicProvinces = [{ id: 1, name: "Hồ Chí Minh", wards: [] }];

describe("PropertyCreateForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    submitActionMock.mockResolvedValue({ id: 1, slug: "mat-bang-demo" });
  });

  it("pre-fills contactName and contactPhone from auth user", async () => {
    authMeResult = {
      data: {
        id: 1,
        fullName: "Test Customer",
        phone: "0901234567",
        email: "customer@example.com",
        role: "CUSTOMER",
      },
      isLoading: false,
    };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={false}
      />,
    );

    await waitFor(
      () => {
        expect(screen.getByDisplayValue("Test Customer")).toBeInTheDocument();
        expect(screen.getByDisplayValue("0901234567")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("does not overwrite existing contact fields when already filled", async () => {
    authMeResult = {
      data: {
        id: 1,
        fullName: "Auth User Full",
        phone: "0909999999",
        email: "customer@example.com",
        role: "CUSTOMER",
      },
      isLoading: false,
    };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={false}
        defaultValues={{
          contactName: "Existing Name",
          contactPhone: "0908888888",
        }}
      />,
    );

    await waitFor(
      () => {
        expect(screen.getByDisplayValue("Existing Name")).toBeInTheDocument();
        expect(screen.getByDisplayValue("0908888888")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("renders loading skeleton when auth is loading", () => {
    authMeResult = { data: null as never, isLoading: true };

    const { container } = renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={false}
      />,
    );

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders login prompt when no auth user", () => {
    authMeResult = { data: null as never, isLoading: false };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={false}
      />,
    );

    expect(
      screen.getByText("Bạn cần đăng nhập trước khi đăng tin."),
    ).toBeInTheDocument();
  });

  it("renders heading and description", () => {
    authMeResult = {
      data: {
        id: 1,
        fullName: "Test Customer",
        phone: "0901234567",
        email: "customer@example.com",
        role: "CUSTOMER",
      },
      isLoading: false,
    };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Cung cấp thông tin cho thuê chi tiết"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={false}
      />,
    );

    expect(screen.getByText("Thông tin tin cho thuê")).toBeInTheDocument();
    expect(
      screen.getByText("Cung cấp thông tin cho thuê chi tiết"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Đăng tin cho thuê" }),
    ).toBeInTheDocument();
  });

  it("hides image gallery and form fields in view-only mode", () => {
    authMeResult = {
      data: {
        id: 1,
        fullName: "Test Customer",
        phone: "0901234567",
        email: "customer@example.com",
        role: "CUSTOMER",
      },
      isLoading: false,
    };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        mode="view-only"
        showSuccessDialog={false}
      />,
    );

    // Submit button should not be visible in view-only mode
    expect(
      screen.queryByRole("button", { name: "Đăng tin cho thuê" }),
    ).not.toBeInTheDocument();
    // Image label shows "Chỉ xem ảnh"
    expect(screen.getByText("Chỉ xem ảnh")).toBeInTheDocument();
  });

  it("renders success dialog when showSuccessDialog is true", async () => {
    authMeResult = {
      data: null as never,
      isLoading: false,
    };

    renderWithProviders(
      <PropertyCreateForm
        categories={basicCategories as never}
        provinces={basicProvinces as never}
        submitAction={submitActionMock}
        title="Thông tin tin cho thuê"
        description="Mô tả"
        submitLabel="Đăng tin cho thuê"
        showSuccessDialog={true}
      />,
    );

    expect(
      screen.getByText("Bạn cần đăng nhập trước khi đăng tin."),
    ).toBeInTheDocument();
  });
});
