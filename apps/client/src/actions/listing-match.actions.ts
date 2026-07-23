"use server";

import { leadService } from "@/services/lead.service";
import { listingMatchService } from "@/services/listing-match.service";

export async function getLeadAction(id: number) {
  return leadService.getById(id);
}

export async function getLeadMatchesAction(leadId: number) {
  return listingMatchService.getByLeadId(leadId);
}

export async function createListingMatchAction(payload: {
  propertyId: number;
  rentRequestId: number;
  leadId?: number;
}) {
  return listingMatchService.create(payload);
}

export async function promoteMatchAction(matchId: number, leadId: number) {
  return listingMatchService.promote(matchId, leadId);
}

export async function qualifySentLeadProposalAction(
  leadId: number,
  proposalId: number,
) {
  return leadService.qualifyMySentLeadProposal(leadId, proposalId);
}

export async function negotiateSentLeadProposalAction(
  leadId: number,
  proposalId: number,
) {
  return leadService.negotiateMySentLeadProposal(leadId, proposalId);
}

export async function rejectSentLeadProposalAction(
  leadId: number,
  proposalId: number,
) {
  return leadService.rejectMySentLeadProposal(leadId, proposalId);
}

export async function revertSentLeadProposalToSuggestedAction(
  leadId: number,
  proposalId: number,
) {
  return leadService.revertMySentLeadProposalToSuggested(leadId, proposalId);
}

export async function revertSentLeadProposalToQualifiedAction(
  leadId: number,
  proposalId: number,
) {
  return leadService.revertMySentLeadProposalToQualified(leadId, proposalId);
}

export async function rejectMatchAction(matchId: number) {
  return listingMatchService.reject(matchId);
}

export async function unmatchMatchAction(matchId: number) {
  return listingMatchService.unmatch(matchId);
}

export async function removeMatchAction(matchId: number) {
  return listingMatchService.remove(matchId);
}

export async function updateLeadStatusAction(
  id: number,
  status: string,
  candidateId?: number,
) {
  const payload: Record<string, unknown> = { status };
  if (candidateId !== undefined) {
    payload.candidateId = candidateId;
  }
  return leadService.update(id, payload);
}
