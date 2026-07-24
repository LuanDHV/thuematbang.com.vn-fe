"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  negotiateSentDealCaseProposalAction,
  qualifySentDealCaseProposalAction,
  rejectSentDealCaseProposalAction,
  revertSentDealCaseProposalToQualifiedAction,
  revertSentDealCaseProposalToSuggestedAction,
} from "@/actions/listing-match.actions";
import { useToast } from "@/components/ui/use-toast";
import type { ProposalReviewStatus, ProposalStatus } from "@/types/enums";

type Props = {
  dealCaseId: number;
  proposalId: number;
  reviewStatus: ProposalReviewStatus;
  status: ProposalStatus;
};

export default function SentLeadProposalActions({
  dealCaseId,
  proposalId,
  reviewStatus,
  status,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  if (reviewStatus !== "APPROVED") {
    return null;
  }

  const handleAction = (
    action: "qualify" | "negotiate" | "reject",
    successTitle: string,
    errorTitle: string,
  ) => {
    startTransition(async () => {
      try {
        if (action === "qualify") {
          await qualifySentDealCaseProposalAction(dealCaseId, proposalId);
        } else if (action === "negotiate") {
          await negotiateSentDealCaseProposalAction(dealCaseId, proposalId);
        } else {
          await rejectSentDealCaseProposalAction(dealCaseId, proposalId);
        }

        toast({ title: successTitle, variant: "success" });
        router.refresh();
      } catch {
        toast({ title: errorTitle, variant: "destructive" });
      }
    });
  };

  const handleUndo = (
    action: "revert-suggested" | "revert-qualified",
    successTitle: string,
    errorTitle: string,
  ) => {
    startTransition(async () => {
      try {
        if (action === "revert-suggested") {
          await revertSentDealCaseProposalToSuggestedAction(
            dealCaseId,
            proposalId,
          );
        } else {
          await revertSentDealCaseProposalToQualifiedAction(
            dealCaseId,
            proposalId,
          );
        }

        toast({ title: successTitle, variant: "success" });
        router.refresh();
      } catch {
        toast({ title: errorTitle, variant: "destructive" });
      }
    });
  };

  const canQualify = status === "SUGGESTED";
  const canNegotiate = status === "QUALIFIED";
  const canReject =
    status === "SUGGESTED" ||
    status === "QUALIFIED" ||
    status === "NEGOTIATING";
  const canRevertToSuggested =
    status === "QUALIFIED" ||
    status === "DEAL_LOST" ||
    status === "CANCELLED_AUTO";
  const canRevertToQualified = status === "NEGOTIATING";

  if (
    !canQualify &&
    !canNegotiate &&
    !canReject &&
    !canRevertToSuggested &&
    !canRevertToQualified
  ) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {canQualify ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
          handleAction(
            "qualify",
            "Xác nhận phù hợp.",
            "Không thể xác nhận đề xuất phù hợp.",
          )
          }
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Phù hợp
        </button>
      ) : null}

      {status === "QUALIFIED" ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleUndo(
              "revert-suggested",
              "Đã hoàn tác về đề xuất mới.",
              "Không thể hoàn tác đề xuất.",
            )
          }
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-body disabled:cursor-not-allowed disabled:opacity-60"
        >
          Hoàn tác
        </button>
      ) : null}

      {canNegotiate ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
          handleAction(
            "negotiate",
            "Đã đàm phán.",
            "Không thể đàm phán.",
          )
          }
          className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Đàm phán
        </button>
      ) : null}

      {canRevertToQualified ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
          handleUndo(
            "revert-qualified",
            "Đã hoàn tác về xác nhận phù hợp.",
            "Không thể hoàn tác đàm phán.",
          )
          }
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-body disabled:cursor-not-allowed disabled:opacity-60"
        >
          Hoàn tác
        </button>
      ) : null}

      {canReject ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleAction(
              "reject",
              "Đã đánh dấu đề xuất không phù hợp.",
              "Không thể cập nhật đề xuất.",
            )
          }
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-body disabled:cursor-not-allowed disabled:opacity-60"
        >
          Không phù hợp
        </button>
      ) : null}

      {canRevertToSuggested && status !== "QUALIFIED" ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleUndo(
              "revert-suggested",
              "Đã mở lại đề xuất.",
              "Không thể mở lại đề xuất.",
            )
          }
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold text-body disabled:cursor-not-allowed disabled:opacity-60"
        >
          Hoàn tác
        </button>
      ) : null}
    </div>
  );
}
