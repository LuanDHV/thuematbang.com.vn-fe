import {
  ensureArray,
  normalizePaginationMeta,
} from "@/services/shared/validation";
import { rentRequestCreateFormSchema } from "@/schemas/listing-create.schema";

describe("validation helpers", () => {
  it("normalizes legacy and current pagination shapes", () => {
    expect(
      normalizePaginationMeta({
        page: 2,
        limit: 10,
        totalItems: 23,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      }),
    ).toMatchObject({
      currentPage: 2,
      limit: 10,
      total: 23,
      totalPage: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it("extracts arrays from supported envelopes and rejects invalid payloads", () => {
    expect(ensureArray([1, 2, 3], "items")).toEqual([1, 2, 3]);
    expect(ensureArray({ items: ["a"] }, "items")).toEqual(["a"]);
    expect(ensureArray({ data: ["b"] }, "items")).toEqual(["b"]);
    expect(() => ensureArray({}, "items")).toThrow(
      "Invalid items response: expected array/items/data array",
    );
  });

  it("allows negotiable rent requests without budget fields", () => {
    const result = rentRequestCreateFormSchema.safeParse({
      title: "Cần thuê mặt bằng",
      slug: "can-thue-mat-bang",
      categoryId: 1,
      desiredProvinceId: 1,
      desiredArea: 100,
      desiredDirection: null,
      contactName: "Nguyen Van A",
      contactPhone: "0901234567",
      isNegotiable: true,
    });

    expect(result.success).toBe(true);
  });

  it("requires budget fields when rent requests are not negotiable", () => {
    const result = rentRequestCreateFormSchema.safeParse({
      title: "Cần thuê mặt bằng",
      slug: "can-thue-mat-bang",
      categoryId: 1,
      desiredProvinceId: 1,
      desiredArea: 100,
      desiredDirection: null,
      contactName: "Nguyen Van A",
      contactPhone: "0901234567",
      isNegotiable: false,
    });

    expect(result.success).toBe(false);
  });
});
