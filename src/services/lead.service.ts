import "server-only";

import { Lead } from "@/types/lead";
import { LeadStatus } from "@/types/enums";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type LeadListFilters = {
  q?: string;
  status?: LeadStatus;
  propertyId?: number;
  userId?: number;
};

export type LeadGetAllParams = {
  filters?: LeadListFilters;
  page?: number;
  limit?: number;
};

export const leadService = {
  getAll: async (params: LeadGetAllParams = {}) =>
    requestServerApi<Lead[]>(buildListPath("/leads", params), {
      auth: "required",
      cache: "no-store",
      tags: ["leads"],
    }),
};
