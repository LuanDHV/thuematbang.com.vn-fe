import { expect, test } from "@playwright/test";

test("login page renders the core auth shell", async ({ page }) => {
  await page.goto("/dang-nhap");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /đăng nhập/i })).toBeVisible();
});
