"use server";

import { dealCaseService } from "@/services/lead.service";
import { proposalService } from "@/services/listing-match.service";

export async function getDealCaseAction(id: number) {
  return dealCaseService.getById(id);
}

export async function getDealCaseProposalsAction(dealCaseId: number) {
  return proposalService.getByDealCaseId(dealCaseId);
}

export async function createProposalAction(payload: {
  propertyId: number;
  rentRequestId: number;
  dealCaseId?: number;
}) {
  return proposalService.create(payload);
}

export async function promoteProposalAction(
  proposalId: number,
  dealCaseId: number,
) {
  return proposalService.promote(proposalId, dealCaseId);
}

export async function qualifySentDealCaseProposalAction(
  dealCaseId: number,
  proposalId: number,
) {
  return dealCaseService.qualifyMySentDealCaseProposal(
    dealCaseId,
    proposalId,
  );
}

export async function negotiateSentDealCaseProposalAction(
  dealCaseId: number,
  proposalId: number,
) {
  return dealCaseService.negotiateMySentDealCaseProposal(
    dealCaseId,
    proposalId,
  );
}

export async function rejectSentDealCaseProposalAction(
  dealCaseId: number,
  proposalId: number,
) {
  return dealCaseService.rejectMySentDealCaseProposal(dealCaseId, proposalId);
}

export async function revertSentDealCaseProposalToSuggestedAction(
  dealCaseId: number,
  proposalId: number,
) {
  return dealCaseService.revertMySentDealCaseProposalToSuggested(
    dealCaseId,
    proposalId,
  );
}

export async function revertSentDealCaseProposalToQualifiedAction(
  dealCaseId: number,
  proposalId: number,
) {
  return dealCaseService.revertMySentDealCaseProposalToQualified(
    dealCaseId,
    proposalId,
  );
}

export async function rejectProposalAction(proposalId: number) {
  return proposalService.reject(proposalId);
}

export async function unmatchProposalAction(proposalId: number) {
  return proposalService.unmatch(proposalId);
}

export async function removeProposalAction(proposalId: number) {
  return proposalService.remove(proposalId);
}

export async function updateDealCaseStatusAction(
  id: number,
  status: string,
  candidateId?: number,
) {
  const payload: Record<string, unknown> = { status };
  if (candidateId !== undefined) {
    payload.candidateId = candidateId;
  }
  return dealCaseService.update(id, payload);
}
