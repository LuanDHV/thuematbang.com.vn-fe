import "server-only";

import type { ProposalSummary } from "@/types/proposal";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type ProposalListFilters = {
  status?: string;
  dealCaseId?: number;
  propertyId?: number;
  rentRequestId?: number;
};

export type ProposalGetAllParams = {
  filters?: ProposalListFilters;
  page?: number;
  limit?: number;
};

export type CreateProposalPayload = {
  propertyId: number;
  rentRequestId: number;
  dealCaseId?: number;
  note?: string;
};

export const proposalService = {
  getAll: async (params: ProposalGetAllParams = {}) =>
    requestServerApi<ProposalSummary[]>(
      buildListPath("/listing-matches", params),
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-matches"],
      },
    ),

  getById: async (id: number) => {
    const response = await requestServerApi<ProposalSummary>(
      `/listing-matches/${id}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-match-detail"],
      },
    );
    return response.data;
  },

  getByDealCaseId: async (dealCaseId: number) => {
    const response = await requestServerApi<ProposalSummary[]>(
      `/listing-matches/by-lead/${dealCaseId}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["listing-matches", `deal-case-${dealCaseId}-proposals`],
      },
    );
    return response.data;
  },

  create: async (payload: CreateProposalPayload) => {
    const response = await requestServerApi<ProposalSummary>(
      "/listing-matches",
      {
        method: "POST",
        auth: "required",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    return response.data;
  },

  promote: async (id: number, dealCaseId: number) => {
    const response = await requestServerApi<ProposalSummary>(
      `/listing-matches/${id}/promote`,
      {
        method: "POST",
        auth: "required",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealCaseId }),
      },
    );
    return response.data;
  },

  reject: async (id: number) => {
    const response = await requestServerApi<ProposalSummary>(
      `/listing-matches/${id}/reject`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  unmatch: async (id: number) => {
    const response = await requestServerApi<ProposalSummary>(
      `/listing-matches/${id}/unmatch`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  remove: async (id: number) => {
    const response = await requestServerApi<ProposalSummary>(
      `/listing-matches/${id}`,
      {
        method: "DELETE",
        auth: "required",
      },
    );
    return response.data;
  },
};
