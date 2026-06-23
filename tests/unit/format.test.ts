import {
  formatAreaValue,
  formatLocationParts,
  formatNegotiablePrice,
  formatNumber,
  formatPrice,
  formatVndAmount,
} from "@/lib/format";
import type { PriceUnit } from "@/types/enums";

describe("format helpers", () => {
  it("formats prices and amounts using the Vietnamese locale", () => {
    expect(formatPrice(15000000)).toContain("15.000.000");
    expect(formatNumber(15000000)).toContain("15.000.000");
    expect(formatVndAmount(15000000)).toContain("15.000.000");
  });

  it("formats area values and negotiable labels", () => {
    expect(formatAreaValue(75.5)).toMatch(/75[,\.]5.*m²/);
    expect(
      formatNegotiablePrice(15000000, false, {
        amount: 12000000,
        unit: "MILLION" as PriceUnit,
      }),
    ).toContain("12");
    expect(
      formatNegotiablePrice(15000000, true, {
        negotiableLabel: "Negotiable",
      }),
    ).toBe("Negotiable");
  });

  it("joins location parts while dropping empty entries", () => {
    expect(formatLocationParts(["Hà Nội", "", undefined, "Cầu Giấy"])).toBe(
      "Hà Nội, Cầu Giấy",
    );
  });
});
