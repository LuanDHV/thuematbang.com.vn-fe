import { buildGoogleMapEmbedSrc } from "@/lib/location/google-map";

describe("buildGoogleMapEmbedSrc", () => {
  it("builds a Google Maps embed URL from latitude and longitude", () => {
    expect(
      buildGoogleMapEmbedSrc({
        latitude: 10.77653,
        longitude: 106.70098,
      }),
    ).toBe(
      "https://www.google.com/maps?q=10.77653%2C106.70098&ll=10.77653%2C106.70098&z=15&output=embed&hl=vi",
    );
  });

  it("accepts numeric strings and rejects invalid coordinates", () => {
    expect(
      buildGoogleMapEmbedSrc({
        latitude: "10.77653",
        longitude: "106.70098",
        zoom: 14,
      }),
    ).toBe(
      "https://www.google.com/maps?q=10.77653%2C106.70098&ll=10.77653%2C106.70098&z=14&output=embed&hl=vi",
    );

    expect(
      buildGoogleMapEmbedSrc({
        latitude: "abc",
        longitude: 106.70098,
      }),
    ).toBeNull();
  });

  it("falls back to text search when coordinates are unavailable", () => {
    expect(
      buildGoogleMapEmbedSrc({
        query: "Phường Bến Nghé, Quận 1, Hồ Chí Minh, Vietnam",
      }),
    ).toBe(
      "https://www.google.com/maps?q=Ph%C6%B0%E1%BB%9Dng+B%E1%BA%BFn+Ngh%C3%A9%2C+Qu%E1%BA%ADn+1%2C+H%E1%BB%93+Ch%C3%AD+Minh%2C+Vietnam&z=15&output=embed&hl=vi",
    );
  });

  it("treats null coordinates as missing and falls back to text search", () => {
    expect(
      buildGoogleMapEmbedSrc({
        latitude: null,
        longitude: null,
        query: "An Phú Đông, Hồ Chí Minh, Vietnam",
      }),
    ).toBe(
      "https://www.google.com/maps?q=An+Ph%C3%BA+%C4%90%C3%B4ng%2C+H%E1%BB%93+Ch%C3%AD+Minh%2C+Vietnam&z=15&output=embed&hl=vi",
    );
  });
});
