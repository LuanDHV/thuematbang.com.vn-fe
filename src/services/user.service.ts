import { User } from "@/types";
import { getApiResponse } from "./shared/api-client";

export const userService = {
  me: async () =>
    (await getApiResponse<User | null>("/users/me", {
      cache: "no-store",
      tags: ["auth-me"],
    })).data,
};


