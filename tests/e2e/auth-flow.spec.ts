import { expect, test, type Page } from "@playwright/test";

function uniqueValue(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function loginAsCustomer(page: Page) {
  await page.goto("/dang-nhap");
  await page.getByLabel("Số điện thoại hoặc email").fill("customer@example.com");
  await page.locator("#password").fill("Password123!");
  await Promise.all([
    page.waitForURL("/"),
    page.getByRole("button", { name: "Đăng nhập" }).click(),
  ]);
}

async function registerUser(page: Page, suffix?: string) {
  const token = suffix || uniqueValue("user");
  await page.goto("/dang-ky");
  await page.getByLabel("Họ và tên").fill(`Người dùng ${token}`);
  await page.getByLabel("Email").fill(`${token}@example.com`);
  await page.getByLabel("Số điện thoại").fill(`0901${String(Date.now()).slice(-6)}`);
  await page.getByLabel("Mật khẩu").first().fill("Password123!");
  await page.getByLabel("Xác nhận mật khẩu").fill("Password123!");

  await Promise.all([
    page.waitForURL("/"),
    page.getByRole("button", { name: "Đăng ký" }).click(),
  ]);
}

test.describe("auth browser flow", () => {
  test("customer can log in and log out through the UI", async ({
    page,
    context,
  }) => {
    await loginAsCustomer(page);
    await page.goto("/dang-tin/cho-thue");
    await expect(page.locator("main")).toContainText("Thông tin tin cho thuê");

    await page.evaluate(async () => {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    });
    await context.clearCookies();

    await page.goto("/dang-tin/cho-thue");
    await expect(
      page.getByText("Bạn cần đăng nhập trước khi đăng tin."),
    ).toBeVisible();
  });

  test("customer can register from the UI and land on the home page", async ({
    page,
    context,
  }) => {
    await registerUser(page);

    await expect(page).toHaveURL(/\/$/);

    const cookies = await context.cookies();
    expect(
      cookies.some((cookie) => cookie.name === "accessToken"),
    ).toBeTruthy();
    expect(
      cookies.some((cookie) => cookie.name === "refreshToken"),
    ).toBeTruthy();
  });
});
