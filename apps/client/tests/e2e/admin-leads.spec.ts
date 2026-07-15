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

const leadsListUrl = "/admin/quan-li-leads/cho-thue";

test.describe("admin leads flow", () => {
  test("admin can view leads list", async ({ page }) => {
    await loginAsAdmin(page, leadsListUrl);
    await expect(page.getByText("Lead").first()).toBeVisible();
  });

  test("admin can navigate to lead detail", async ({ page }) => {
    await loginAsAdmin(page, leadsListUrl);
    const leadLink = page
      .locator('a[href*="/admin/quan-li-leads/cho-thue/"]')
      .first();
    const leadHref = await leadLink.getAttribute("href");
    await expect(leadLink).toBeVisible();
    await leadLink.click();
    await expect(page).toHaveURL(
      new RegExp(`${(leadHref ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    );
    await expect(page.getByRole("heading", { name: /Lead #/ })).toBeVisible();
  });

  test("lead detail shows overview cards and candidates", async ({ page }) => {
    await loginAsAdmin(page, "/admin/quan-li-leads/cho-thue/1");
    await expect(page.getByRole("heading", { name: /Lead #/ })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Đề xuất" }),
    ).toBeVisible();
  });
});
