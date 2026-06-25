import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges tailwind classes while keeping the latest override", () => {
    expect(cn("p-2", "p-4", false && "hidden", undefined)).toBe("p-4");
  });
});
