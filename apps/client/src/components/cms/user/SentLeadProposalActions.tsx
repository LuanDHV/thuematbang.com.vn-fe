"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  negotiateSentLeadProposalAction,
  qualifySentLeadProposalAction,
  rejectSentLeadProposalAction,
  revertSentLeadProposalToQualifiedAction,
  revertSentLeadProposalToSuggestedAction,
} from "@/actions/listing-match.actions";
import { useToast } from "@/components/ui/use-toast";
import type { ListingMatchApprovalStatus } from "@/types/listing-match";
import type { ListingMatchStatus } from "@/types/enums";

type Props = {
  leadId: number;
  proposalId: number;
  approvalStatus: ListingMatchApprovalStatus;
  status: ListingMatchStatus;
};

export default function SentLeadProposalActions({
  leadId,
  proposalId,
  approvalStatus,
  status,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  if (approvalStatus !== "APPROVED") {
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
          await qualifySentLeadProposalAction(leadId, proposalId);
        } else if (action === "negotiate") {
          await negotiateSentLeadProposalAction(leadId, proposalId);
        } else {
          await rejectSentLeadProposalAction(leadId, proposalId);
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
          await revertSentLeadProposalToSuggestedAction(leadId, proposalId);
        } else {
          await revertSentLeadProposalToQualifiedAction(leadId, proposalId);
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
              "Đã xác nhận đề xuất phù hợp.",
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
              "Đã chuyển đề xuất sang đàm phán.",
              "Không thể chuyển đề xuất sang đàm phán.",
            )
          }
          className="rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          Chuyển sang đàm phán
        </button>
      ) : null}

      {canRevertToQualified ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            handleUndo(
              "revert-qualified",
              "Đã hoàn tác về đã xác nhận phù hợp.",
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
