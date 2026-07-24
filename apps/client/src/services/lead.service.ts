import "server-only";

import { DealCase } from "@/types/lead";
import type { DealCaseSourceFilter } from "@/types/lead";
import { DealCaseStatus } from "@/types/enums";
import { HttpError } from "@/lib/http";
import { readAuthCookies } from "@/lib/server/auth-cookies";
import { requestServerApi } from "./shared/server-api-client";
import { buildListPath } from "./shared/list-service";

export type DealCaseListFilters = {
  q?: string;
  status?: DealCaseStatus;
  source?: DealCaseSourceFilter;
  propertyId?: number;
  rentRequestId?: number;
  userId?: number;
};

export type DealCaseGetAllParams = {
  filters?: DealCaseListFilters;
  page?: number;
  limit?: number;
};

export type DealCaseUpsertPayload = {
  fullName: string;
  phone: string;
  status?: DealCaseStatus | null;
  userId?: number | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
  note?: string | null;
  completedAt?: string | null;
  winningProposalId?: number | null;
  closureReason?: string | null;
  closureReasonDetail?: string | null;
  closureNote?: string | null;
  // Counterpart selection
  selectedRentRequestIds?: number[];
  selectedPropertyIds?: number[];
};

export type MarketplaceCaseType = "PROPERTY" | "RENT_REQUEST";

export type MarketplaceCaseListParams = {
  type: MarketplaceCaseType;
  page?: number;
  limit?: number;
};

export const dealCaseService = {
  getAll: async (params: DealCaseGetAllParams = {}) =>
    requestServerApi<DealCase[]>(buildListPath("/leads", params), {
      auth: "required",
      cache: "no-store",
      tags: ["leads"],
    }),

  getById: async (id: number) => {
    const response = await requestServerApi<DealCase>(`/leads/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["lead-detail", String(id)],
    });
    return response.data;
  },

  create: async (payload: DealCaseUpsertPayload) => {
    const response = await requestServerApi<DealCase>("/leads", {
      method: "POST",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  createPublic: async (payload: DealCaseUpsertPayload) => {
    const { accessToken, refreshToken } = await readAuthCookies();
    const hasAuthCookies = Boolean(accessToken || refreshToken);

    const submit = async (auth: "none" | "required") => {
      const response = await requestServerApi<DealCase>("/leads", {
        method: "POST",
        auth,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.data;
    };

    if (!hasAuthCookies) {
      return submit("none");
    }

    try {
      return await submit("required");
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        return submit("none");
      }
      throw error;
    }
  },

  update: async (id: number, payload: Partial<DealCaseUpsertPayload>) => {
    const response = await requestServerApi<DealCase>(`/leads/${id}`, {
      method: "PATCH",
      auth: "required",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  remove: async (id: number) => {
    const response = await requestServerApi<DealCase>(`/leads/${id}`, {
      method: "DELETE",
      auth: "required",
    });
    return response.data;
  },

  getMyMarketplaceCases: async (params: MarketplaceCaseListParams) =>
    requestServerApi<DealCase[]>(
      buildListPath("/users/me/marketplace-cases", {
        page: params.page,
        limit: params.limit,
        filters: {
          type: params.type,
        },
      }),
      {
        auth: "required",
        cache: "no-store",
        tags: ["marketplace-cases", params.type],
      },
    ),

  getMyMarketplaceCaseById: async (id: number) => {
    const response = await requestServerApi<DealCase>(
      `/users/me/marketplace-cases/${id}`,
      {
        auth: "required",
        cache: "no-store",
        tags: ["marketplace-case-detail", String(id)],
      },
    );
    return response.data;
  },

  getMySentDealCases: async (params: MarketplaceCaseListParams) =>
    requestServerApi<DealCase[]>(
      buildListPath("/users/me/sent-leads", {
        page: params.page,
        limit: params.limit,
        filters: {
          type: params.type,
        },
      }),
      {
        auth: "required",
        cache: "no-store",
        tags: ["sent-leads", params.type],
      },
    ),

  getMySentDealCaseById: async (id: number) => {
    const response = await requestServerApi<DealCase>(`/users/me/sent-leads/${id}`, {
      auth: "required",
      cache: "no-store",
      tags: ["sent-lead-detail", String(id)],
    });
    return response.data;
  },

  qualifyMySentDealCaseProposal: async (
    dealCaseId: number,
    proposalId: number,
  ) => {
    const response = await requestServerApi(
      `/users/me/sent-leads/${dealCaseId}/proposals/${proposalId}/qualify`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  negotiateMySentDealCaseProposal: async (
    dealCaseId: number,
    proposalId: number,
  ) => {
    const response = await requestServerApi(
      `/users/me/sent-leads/${dealCaseId}/proposals/${proposalId}/negotiate`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  rejectMySentDealCaseProposal: async (
    dealCaseId: number,
    proposalId: number,
  ) => {
    const response = await requestServerApi(
      `/users/me/sent-leads/${dealCaseId}/proposals/${proposalId}/reject`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  revertMySentDealCaseProposalToSuggested: async (
    dealCaseId: number,
    proposalId: number,
  ) => {
    const response = await requestServerApi(
      `/users/me/sent-leads/${dealCaseId}/proposals/${proposalId}/revert-suggested`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },

  revertMySentDealCaseProposalToQualified: async (
    dealCaseId: number,
    proposalId: number,
  ) => {
    const response = await requestServerApi(
      `/users/me/sent-leads/${dealCaseId}/proposals/${proposalId}/revert-qualified`,
      {
        method: "POST",
        auth: "required",
      },
    );
    return response.data;
  },
};
