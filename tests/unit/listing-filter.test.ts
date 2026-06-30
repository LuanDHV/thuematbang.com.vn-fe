import {
  FILTER_LIMITS,
  mockFilterAreaOptions,
  mockFilterPriceOptions,
} from "@/constants/filter";
import { resolveAreaSummary, resolvePriceSummary, toAreaRange, toPriceRange } from "@/lib/filter/filter-helpers";
import {
  buildPropertyFilterPath,
  extractPropertyFilterRouteParts,
  parsePropertyFilterSlug,
} from "@/lib/listing/flat-url";
import { INITIAL_ADVANCED_FILTER_VALUE } from "@/types/filter";

describe("listing filter helpers", () => {
  const propertyCategories = [{ name: "Biệt thự", slug: "biet-thu" }];

  it("uses the updated range caps for price and area", () => {
    expect(toPriceRange("", "")).toEqual([0, FILTER_LIMITS.PRICE_MAX_MILLION]);
    expect(toAreaRange("", "")).toEqual([0, FILTER_LIMITS.AREA_MAX]);
  });

  it("builds and parses biet-thu flat urls", () => {
    const filters = {
      ...INITIAL_ADVANCED_FILTER_VALUE,
      propertyTypes: ["Biệt thự"],
    };

    expect(
      buildPropertyFilterPath("/cho-thue", filters, { propertyCategories }),
    ).toBe("/cho-thue/biet-thu");
    expect(parsePropertyFilterSlug("biet-thu")).toMatchObject({
      propertyTypes: ["Biệt thự"],
    });
    expect(extractPropertyFilterRouteParts("biet-thu")).toEqual({
      categorySlug: "biet-thu",
    });
  });

  it("resolves the updated preset labels", () => {
    expect(
      resolvePriceSummary(
        {
          ...INITIAL_ADVANCED_FILTER_VALUE,
          priceMin: "7000000000",
          priceMax: "10000000000",
        },
        mockFilterPriceOptions,
      ),
    ).toBe("7 - 10 tỷ");

    expect(
      resolveAreaSummary(
        {
          ...INITIAL_ADVANCED_FILTER_VALUE,
          areaMin: "10000",
          areaMax: "20000",
        },
        mockFilterAreaOptions,
      ),
    ).toBe("10.000 m² - 20.000 m²");
  });
});
