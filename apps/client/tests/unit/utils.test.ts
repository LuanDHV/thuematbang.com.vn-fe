import { cn } from "@/lib/utils";
import { formatDisplayNumber, normalizeNumberInput } from "@/lib/form/number-input";

describe("cn", () => {
  it("merges tailwind classes while keeping the latest override", () => {
    expect(cn("p-2", "p-4", false && "hidden", undefined)).toBe("p-4");
  });
});

describe("number input helpers", () => {
  it("parses decimal input and preserves fraction digits for currency display", () => {
    expect(normalizeNumberInput("2.5")).toBe(2.5);
    expect(formatDisplayNumber(2.5, "currency")).toContain(",5");
  });
});
