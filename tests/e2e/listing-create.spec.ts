import { expect, test, type Page } from "@playwright/test";

const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2k3rkAAAAASUVORK5CYII=",
  "base64",
);

function uniqueValue(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function loginAsCustomer(page: Page) {
  await page.goto("/dang-nhap");
  await page
    .getByLabel("Số điện thoại hoặc email")
    .fill("customer@example.com");
  await page.locator("#password").fill("Password123!");
  await Promise.all([
    page.waitForURL("/"),
    page.getByRole("button", { name: "Đăng nhập" }).click(),
  ]);
}

async function selectRadixOption(
  page: Page,
  labelText: string,
  optionText: string,
) {
  await page.getByLabel(labelText).click();
  await page.getByRole("option", { name: optionText }).click();
}

async function selectSearchableSelect(
  page: Page,
  labelText: string,
  optionText: string,
) {
  await page.getByLabel(labelText).click();
  const option = page.getByRole("button", { name: optionText, exact: true });
  await option.waitFor({ state: "visible" });
  await option.click();
}

async function uploadSingleImage(page: Page) {
  await page.locator("#listing-gallery-images").setInputFiles({
    name: "cover.png",
    mimeType: "image/png",
    buffer: tinyPngBuffer,
  });
}

async function fillPropertyCreateForm(page: Page, title: string) {
  await page.getByLabel("Họ và tên").fill("Nguyễn Văn A");
  await page.getByLabel("Số điện thoại").fill("0901234567");
  await page.locator("#title").fill(title);
  await selectRadixOption(page, "Danh mục", "Mặt bằng");
  await page.getByLabel("Thương lượng").check();
  await page.getByLabel("Diện tích").fill("120");
  await selectSearchableSelect(page, "Khu vực", "Hồ Chí Minh");
  await selectSearchableSelect(page, "Phường/xã", "Quận 1");
  await page.getByLabel("Địa chỉ chi tiết").fill("123 Lê Lợi");
  await uploadSingleImage(page);
}

async function fillRentRequestCreateForm(page: Page, title: string) {
  await page.getByLabel("Họ và tên").fill("Nguyễn Văn B");
  await page.getByLabel("Số điện thoại").fill("0907654321");
  await page.locator("#title").fill(title);
  await selectRadixOption(page, "Danh mục", "Căn hộ chung cư");
  await page.locator("#budgetAmount").fill("15000000");
  await page.locator("#budgetUnit").click();
  await page.getByRole("option", { name: /^Triệu$/ }).click();
  await page.getByLabel("Diện tích mong muốn").fill("75");
  await selectSearchableSelect(page, "Khu vực mong muốn", "Hồ Chí Minh");
  await selectSearchableSelect(page, "Phường/xã mong muốn", "Quận 1");
}

async function fillNegotiableRentRequestCreateForm(
  page: Page,
  title: string,
) {
  await page.getByLabel("Họ và tên").fill("Nguyễn Văn B");
  await page.getByLabel("Số điện thoại").fill("0907654321");
  await page.locator("#title").fill(title);
  await selectRadixOption(page, "Danh mục", "Căn hộ chung cư");
  await page.getByLabel("Thương lượng").check();
  await page.getByLabel("Diện tích mong muốn").fill("75");
  await selectSearchableSelect(page, "Khu vực mong muốn", "Hồ Chí Minh");
  await selectSearchableSelect(page, "Phường/xã mong muốn", "Quận 1");
}

test.describe("listing creation", () => {
  test("customer can submit a property listing", async ({ page }) => {
    await loginAsCustomer(page);
    const title = `Mặt bằng demo ${uniqueValue("property")}`;

    await page.goto("/dang-tin/cho-thue");
    await expect(page.locator("main")).toContainText("Thông tin tin cho thuê");

    await fillPropertyCreateForm(page, title);
    await page.getByRole("button", { name: "Đăng tin cho thuê" }).click();

    await expect(page.getByRole("dialog")).toContainText("Tin đã được gửi");
    await expect(page.getByRole("dialog")).toContainText(
      "Theo dõi trạng thái",
    );

    await page.getByRole("link", { name: "Theo dõi trạng thái" }).click();
    await expect(page).toHaveURL("/quan-li-tai-khoan/cho-thue");
  });

  test("customer can submit a rent-request listing", async ({ page }) => {
    await loginAsCustomer(page);
    const title = `Cần thuê demo ${uniqueValue("rent")}`;

    await page.goto("/dang-tin/can-thue");
    await expect(page.locator("main")).toContainText(
      "Thông tin nhu cầu cần thuê",
    );

    await fillRentRequestCreateForm(page, title);
    await page.getByRole("button", { name: "Đăng yêu cầu thuê" }).click();

    await expect(page.getByRole("dialog")).toContainText("Tin đã được gửi");
    await expect(page.getByRole("dialog")).toContainText(
      "Theo dõi trạng thái",
    );

    await page.getByRole("link", { name: "Theo dõi trạng thái" }).click();
    await expect(page).toHaveURL("/quan-li-tai-khoan/cau-thue");
  });

  test("customer can submit a negotiable rent-request listing without budget", async ({
    page,
  }) => {
    await loginAsCustomer(page);
    const title = `Cần thuê thương lượng ${uniqueValue("rent-negotiable")}`;

    await page.goto("/dang-tin/can-thue");
    await expect(page.locator("main")).toContainText(
      "Thông tin nhu cầu cần thuê",
    );

    await fillNegotiableRentRequestCreateForm(page, title);
    await page.getByRole("button", { name: "Đăng yêu cầu thuê" }).click();

    await expect(page.getByRole("dialog")).toContainText("Tin đã được gửi");
    await page.getByRole("link", { name: "Theo dõi trạng thái" }).click();
    await expect(page).toHaveURL("/quan-li-tai-khoan/cau-thue");
  });
});
