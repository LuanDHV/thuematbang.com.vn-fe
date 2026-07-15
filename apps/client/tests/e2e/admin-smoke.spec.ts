import { expect, test, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page, nextPath = "/admin") {
  await page.goto(`/dang-nhap-admin?next=${encodeURIComponent(nextPath)}`);
  await page.getByLabel("Số điện thoại hoặc email").fill("admin@example.com");
  await page.locator("#password").fill("Admin123!");
  await Promise.all([
    page.waitForURL(
      new RegExp(`${nextPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    ),
    page.getByRole("button", { name: "Đăng nhập" }).click(),
  ]);
}

test.describe("admin smoke", () => {
  test("anonymous users are redirected away from the admin shell", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/dang-nhap-admin\?next=%2Fadmin$/);
  });

  test("admin users can open the dashboard", async ({ page }) => {
    await loginAsAdmin(page, "/admin");
    await expect(page.getByText("Tổng quan vận hành CMS")).toBeVisible();
  });
});
