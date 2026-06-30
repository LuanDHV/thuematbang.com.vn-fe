"use server";

import { leadService, type LeadUpsertPayload } from "@/services/lead.service";

export async function createPublicLeadAction(payload: LeadUpsertPayload) {
  return leadService.createPublic(payload);
}
