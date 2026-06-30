import { expect, test, type Page } from "@playwright/test";

import { registerUser, uniqueValue } from "./helpers";

async function patchListing(
  page: Page,
  resource: "properties" | "rent-requests",
  id: number,
  body: Record<string, unknown>,
) {
  const payload = (await page.evaluate(async ({ resource, id, body }) => {
    const response = await fetch(`/api/v1/${resource}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return {
      ok: response.ok,
      json: await response.json(),
    };
  }, {
    resource,
    id,
    body,
  })) as { ok: boolean; json: unknown };
  expect(payload.ok).toBeTruthy();
  return payload.json;
}

async function createProperty(page: Page, title: string) {
  const payload = (await page.evaluate(async ({ title }) => {
    const response = await fetch("/api/v1/properties", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        categoryId: 12,
        priceAmount: 25000000,
        priceUnit: "MILLION",
        isNegotiable: false,
        area: 120,
        provinceId: 1,
        wardId: 11,
        contactName: "Test Customer",
        contactPhone: "0901000001",
        content: "Noi dung demo",
        priorityStatus: "FREE",
        publishSource: "FREE_QUOTA",
        images: [],
      }),
    });
    return {
      ok: response.ok,
      json: await response.json(),
    };
  }, {
    title,
  })) as { ok: boolean; json: { data?: { id?: number } } };
  expect(payload.ok).toBeTruthy();
  const { json } = payload;
  expect(json.data?.id).toBeTruthy();
  return json.data?.id as number;
}

async function createRentRequest(page: Page, title: string) {
  const payload = (await page.evaluate(async ({ title }) => {
    const response = await fetch("/api/v1/rent-requests", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        categoryId: 21,
        desiredProvinceId: 1,
        desiredWardId: 11,
        budgetAmount: 15000000,
        budgetUnit: "MILLION",
        budget: 15000000,
        isNegotiable: false,
        desiredArea: 75,
        contactName: "Test Customer",
        contactPhone: "0901000001",
        requirementText: "Uu tien gan trung tam",
      }),
    });
    return {
      ok: response.ok,
      json: await response.json(),
    };
  }, {
    title,
  })) as { ok: boolean; json: { data?: { id?: number } } };
  expect(payload.ok).toBeTruthy();
  const { json } = payload;
  expect(json.data?.id).toBeTruthy();
  return json.data?.id as number;
}

test.describe("user dashboard status flows", () => {
  test("property detail shows reject reason and allows resubmit", async ({
    page,
  }) => {
    await registerUser(page, uniqueValue("customer-property"));
    const title = `Mặt bằng dashboard ${uniqueValue("property-status")}`;
    const rejectReason = "Thiếu giấy tờ xác minh quyền sử dụng";

    const id = await createProperty(page, title);
    const item = { id, title };
    await patchListing(page, "properties", item.id, {
      status: "REJECTED",
      rejectReason,
    });

    await page.goto(`/quan-li-tai-khoan/cho-thue/${item.id}`);
    await expect(page.getByText(rejectReason)).toBeVisible();
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toBeVisible();

    await page.getByRole("button", { name: "Gửi lại duyệt" }).click();
    await expect(page.getByText("Tin đã được gửi")).toBeVisible();
    const resubmitted = await page.evaluate(async (id) => {
      const response = await fetch(`/api/v1/properties/${id}`, {
        credentials: "include",
      });
      return {
        ok: response.ok,
        json: await response.json(),
      };
    }, item.id);
    expect(resubmitted.ok).toBeTruthy();
    const resubmittedBody = resubmitted.json as {
      data?: { status?: string };
    };
    expect(resubmittedBody.data?.status).toBe("PENDING");

    await page.goto(`/quan-li-tai-khoan/cho-thue/${item.id}`);
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toHaveCount(0);

    await patchListing(page, "properties", item.id, {
      status: "PUBLISHED",
    });
    await page.goto(`/quan-li-tai-khoan/cho-thue/${item.id}`);
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toHaveCount(0);
  });

  test("rent request detail shows reject reason and allows resubmit", async ({
    page,
  }) => {
    await registerUser(page, uniqueValue("customer-rent"));
    const title = `Nhu cầu dashboard ${uniqueValue("rent-status")}`;
    const rejectReason = "Thông tin ngân sách chưa rõ ràng";

    const id = await createRentRequest(page, title);
    const item = { id, title };
    await patchListing(page, "rent-requests", item.id, {
      status: "REJECTED",
      rejectReason,
    });

    await page.goto(`/quan-li-tai-khoan/can-thue/${item.id}`);
    await expect(page.getByText(rejectReason)).toBeVisible();
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toBeVisible();

    await page.getByRole("button", { name: "Gửi lại duyệt" }).click();
    await expect(page.getByText("Tin đã được gửi")).toBeVisible();
    const resubmitted = await page.evaluate(async (id) => {
      const response = await fetch(`/api/v1/rent-requests/${id}`, {
        credentials: "include",
      });
      return {
        ok: response.ok,
        json: await response.json(),
      };
    }, item.id);
    expect(resubmitted.ok).toBeTruthy();
    const resubmittedBody = resubmitted.json as {
      data?: { status?: string };
    };
    expect(resubmittedBody.data?.status).toBe("PENDING");

    await page.goto(`/quan-li-tai-khoan/can-thue/${item.id}`);
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toHaveCount(0);

    await patchListing(page, "rent-requests", item.id, {
      status: "PUBLISHED",
    });
    await page.goto(`/quan-li-tai-khoan/can-thue/${item.id}`);
    await expect(page.getByRole("button", { name: "Gửi lại duyệt" })).toHaveCount(0);
  });
});
