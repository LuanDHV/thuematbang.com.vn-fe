import {
  LISTING_MATCH_STATUS_OPTIONS,
  LISTING_MATCH_STATUS_LABEL_MAP,
} from "@/constants/enum-options";

describe("LISTING_MATCH_STATUS_OPTIONS", () => {
  it("contains all three statuses", () => {
    const values = LISTING_MATCH_STATUS_OPTIONS.map((o) => o.value);
    expect(values).toEqual(["CANDIDATE", "MATCHED", "REJECTED"]);
  });

  it("has Vietnamese labels for each status", () => {
    const labels = Object.fromEntries(
      LISTING_MATCH_STATUS_OPTIONS.map((o) => [o.value, o.label]),
    );
    expect(labels).toEqual({
      CANDIDATE: "Đề xuất ghép",
      MATCHED: "Đã ghép",
      REJECTED: "Từ chối",
    });
  });
});

describe("LISTING_MATCH_STATUS_LABEL_MAP", () => {
  it("maps each status to correct label", () => {
    expect(LISTING_MATCH_STATUS_LABEL_MAP.CANDIDATE).toBe("Đề xuất ghép");
    expect(LISTING_MATCH_STATUS_LABEL_MAP.MATCHED).toBe("Đã ghép");
    expect(LISTING_MATCH_STATUS_LABEL_MAP.REJECTED).toBe("Từ chối");
  });

  it("contains exactly 3 entries", () => {
    expect(Object.keys(LISTING_MATCH_STATUS_LABEL_MAP)).toHaveLength(3);
  });
});
