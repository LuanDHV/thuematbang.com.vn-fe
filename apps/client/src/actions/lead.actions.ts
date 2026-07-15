"use server";

import { leadService, type LeadUpsertPayload } from "@/services/lead.service";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";
import { getServerAuthUser } from "@/lib/server/server-auth";

export async function createPublicLeadAction(payload: LeadUpsertPayload) {
  return leadService.createPublic(payload);
}

export async function getMyEligiblePropertiesAction() {
  const authUser = await getServerAuthUser();
  if (!authUser) return [];

  try {
    const result = await propertyService.getMine({
      page: 1,
      limit: 100,
    });
    return (result.data ?? []).filter(
      (p: { status: string }) => p.status === "PUBLISHED",
    );
  } catch {
    return [];
  }
}

export async function getMyEligibleRentRequestsAction() {
  const authUser = await getServerAuthUser();
  if (!authUser) return [];

  try {
    const result = await rentRequestService.getMine({
      page: 1,
      limit: 100,
    });
    return (result.data ?? []).filter(
      (r: { status: string }) => r.status === "PUBLISHED",
    );
  } catch {
    return [];
  }
}
