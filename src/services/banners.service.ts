import "server-only";

import { Banner } from "@/types/banner";
import { requestServerApi } from "./shared/server-api-client";

export const bannersService = {
  getAll: async () =>
    requestServerApi<Banner[]>("/banners", {
      revalidate: 300,
      tags: ["banners"],
    }),
};
