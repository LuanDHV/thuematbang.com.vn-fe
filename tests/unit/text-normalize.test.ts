import {
  compactSlugToken,
  humanizeSlugToken,
  normalizeVietnameseText,
} from "@/lib/text/text-normalize";

describe("text normalization helpers", () => {
  it("normalizes Vietnamese accents and casing", () => {
    expect(normalizeVietnameseText("Căn hộ Quận 1")).toBe("can ho quan 1");
  });

  it("creates slug-safe tokens and human readable labels", () => {
    expect(compactSlugToken("Căn hộ Quận 1")).toBe("can-ho-quan-1");
    expect(humanizeSlugToken("can-ho-quan-1")).toBe("Can Ho Quan 1");
    expect(humanizeSlugToken("")).toBe("");
  });
});
