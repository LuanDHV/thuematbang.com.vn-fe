import { expect, type Page } from "@playwright/test";

export const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2k3rkAAAAASUVORK5CYII=",
  "base64",
);

export function uniqueValue(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function loginAsCustomer(page: Page) {
  const token = uniqueValue("customer");
  const response = await page.request.post("/api/v1/auth/register", {
    data: {
      fullName: `Customer ${token}`,
      email: `${token}@example.com`,
      phone: `0901${String(Date.now()).slice(-6)}`,
      password: "Password123!",
    },
  });
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as {
    accessToken?: string;
    refreshToken?: string;
  };

  await page.context().addCookies(
    ["accessToken", "refreshToken"].flatMap((name) => {
      const value = payload[name as "accessToken" | "refreshToken"];
      return value
        ? [
            {
              name,
              value,
              domain: "127.0.0.1",
              path: "/",
            },
          ]
        : [];
    }),
  );

  await page.goto("/");
}

export async function registerUser(page: Page, suffix?: string) {
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

export async function selectRadixOption(
  page: Page,
  labelText: string,
  optionText: string,
) {
  await page.getByLabel(labelText).click();
  await page.getByRole("option", { name: optionText }).click();
}

export async function selectSearchableSelect(
  page: Page,
  labelText: string,
  optionText: string,
) {
  await page.getByLabel(labelText).click();
  const option = page.getByRole("button", { name: optionText, exact: true });
  await expect(option).toBeVisible();
  await option.click();
}

export async function uploadSingleImage(page: Page) {
  await page.locator("#listing-gallery-images").setInputFiles({
    name: "cover.png",
    mimeType: "image/png",
    buffer: tinyPngBuffer,
  });
  await expect(page.getByText("Ảnh mới")).toBeVisible();
}

export async function fillPropertyCreateForm(page: Page, title: string) {
  await page.getByLabel("Họ và tên").fill("Nguyễn Văn A");
  await page.getByLabel("Số điện thoại").fill("0901234567");
  await page.getByLabel("Tiêu đề").fill(title);
  await selectRadixOption(page, "Danh mục", "Mặt bằng");
  await page.getByLabel("Thương lượng").check();
  await page.getByLabel("Diện tích").fill("120");
  await selectSearchableSelect(page, "Khu vực", "Hồ Chí Minh");
  await selectSearchableSelect(page, "Phường/xã", "Quận 1");
  await page.getByLabel("Địa chỉ chi tiết").fill("123 Lê Lợi");
  await uploadSingleImage(page);
}

export async function fillRentRequestCreateForm(page: Page, title: string) {
  await page.getByLabel("Họ và tên").fill("Nguyễn Văn B");
  await page.getByLabel("Số điện thoại").fill("0907654321");
  await page.getByLabel("Tiêu đề").fill(title);
  await selectRadixOption(page, "Danh mục", "Căn hộ chung cư");
  await page.locator("#budgetAmount").fill("15000000");
  await page.locator("#budgetUnit").click();
  await page.getByRole("option", { name: /^Triệu$/ }).click();
  await page.getByLabel("Diện tích mong muốn").fill("75");
  await selectSearchableSelect(page, "Khu vực mong muốn", "Hồ Chí Minh");
  await selectSearchableSelect(page, "Phường/xã mong muốn", "Quận 1");
}

export async function openAdvancedFilterDrawer(page: Page) {
  await page.getByRole("button", { name: "Mở bộ lọc nâng cao" }).click();
  await expect(page.getByRole("dialog", { name: "Bộ lọc nâng cao" })).toBeVisible();
}
