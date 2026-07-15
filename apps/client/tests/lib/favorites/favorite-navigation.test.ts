import {
  buildFavoriteRoute,
  resolveFavoriteRouteState,
} from "@/lib/favorites/favorite-navigation";

describe("favorite-navigation", () => {
  it("resolves the default route to property favorites", () => {
    expect(resolveFavoriteRouteState()).toEqual({
      entityType: "PROPERTY",
      status: "active",
    });
  });

  it("resolves slug segments to entity and status", () => {
    expect(resolveFavoriteRouteState(["du-an", "da-bo-quan-tam"])).toEqual({
      entityType: "PROJECT",
      status: "inactive",
    });
  });

  it("falls back to the default entity when the slug is unknown", () => {
    expect(resolveFavoriteRouteState(["unknown", "da-bo-quan-tam"])).toEqual({
      entityType: "PROPERTY",
      status: "inactive",
    });
  });

  it("builds canonical routes without enum names", () => {
    expect(
      buildFavoriteRoute({
        entityType: "RENT_REQUEST",
        status: "inactive",
        page: 2,
      }),
    ).toBe("/quan-li-tai-khoan/da-quan-tam/can-thue/da-bo-quan-tam?page=2");
  });
});
