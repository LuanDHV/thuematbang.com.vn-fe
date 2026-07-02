"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { updateLeadAction } from "@/actions/admin-crud.actions";
import {
  getLeadAction,
  getLeadMatchesAction,
  promoteMatchAction,
  rejectMatchAction,
  removeMatchAction,
  unmatchMatchAction,
} from "@/actions/listing-match.actions";
import AdminLeadAddCandidateDialog from "@/components/cms/admin/AdminLeadAddCandidateDialog";
import AdminLeadMatchesSection from "@/components/cms/admin/AdminLeadMatchesSection";
import AdminLeadOverviewCards from "@/components/cms/admin/AdminLeadOverviewCards";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LEAD_STATUS_LABEL_MAP } from "@/constants/enum-options";

import type { LeadSourceFilter } from "@/types/lead";
import type { LeadStatus } from "@/types/enums";

type AdminLeadDetailSectionProps = {
  leadId: number;
  source: LeadSourceFilter;
};

const sourceCardLabelMap: Record<LeadSourceFilter, string> = {
  PROPERTY: "Tin cho thuê gốc",
  RENT_REQUEST: "Tin cần thuê gốc",
};

const counterpartTypeLabelMap: Record<LeadSourceFilter, string> = {
  PROPERTY: "Cần thuê",
  RENT_REQUEST: "Cho thuê",
};

const leadQueryKey = (leadId: number) => ["lead", leadId] as const;
const leadMatchesQueryKey = (leadId: number) =>
  ["lead-matches", leadId] as const;

export default function AdminLeadDetailSection({
  leadId,
  source,
}: AdminLeadDetailSectionProps) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [updating, setUpdating] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const {
    data: lead,
    isLoading: leadLoading,
    isError: leadError,
  } = useQuery({
    queryKey: leadQueryKey(leadId),
    queryFn: () => getLeadAction(leadId),
  });

  const { data: candidates = [] } = useQuery({
    queryKey: leadMatchesQueryKey(leadId),
    queryFn: () => getLeadMatchesAction(leadId),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: leadQueryKey(leadId),
    });
    await queryClient.invalidateQueries({
      queryKey: leadMatchesQueryKey(leadId),
    });
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;

    const activeCandidates = candidates.filter(
      (candidate) => candidate.status === "CANDIDATE",
    );

    if (newStatus === "QUALIFIED" && activeCandidates.length > 0) {
      toast({
        title: "Cần chọn đề xuất",
        description:
          "Lead này đang có đề xuất ghép. Hãy chọn một đề xuất ở bên dưới để xác nhận.",
      });
      return;
    }

    setUpdating(true);
    try {
      await updateLeadAction(leadId, { status: newStatus });
      await invalidate();
      toast({
        title: "Đã cập nhật",
        description: `Trạng thái chuyển sang ${LEAD_STATUS_LABEL_MAP[newStatus]}.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể cập nhật.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePromote = async (matchId: number) => {
    setUpdating(true);
    try {
      await promoteMatchAction(matchId, leadId);
      await invalidate();
      toast({ title: "Đã ghép", variant: "success" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể xác nhận phù hợp.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (matchId: number) => {
    setUpdating(true);
    try {
      await rejectMatchAction(matchId);
      await invalidate();
      toast({ title: "Đã từ chối", variant: "success" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể từ chối.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUnmatch = async (matchId: number) => {
    setUpdating(true);
    try {
      await unmatchMatchAction(matchId);
      await invalidate();
      toast({ title: "Đã hủy ghép", variant: "success" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể hủy ghép.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveCandidate = async (matchId: number) => {
    setUpdating(true);
    try {
      await removeMatchAction(matchId);
      await invalidate();
      toast({ title: "Đã xóa", variant: "success" });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (leadLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-secondary">Đang tải...</p>
      </div>
    );
  }

  if (leadError || !lead) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">Không tìm thấy lead</p>
      </div>
    );
  }

  const sourceListing =
    source === "PROPERTY" ? lead.property : lead.rentRequest;
  const sourceCardLabel = sourceCardLabelMap[source];
  const counterpartTypeLabel = counterpartTypeLabelMap[source];
  const sourceListingTitle = sourceListing?.title ?? "—";
  const sourceListingHref = sourceListing?.slug
    ? source === "PROPERTY"
      ? `/cho-thue/${sourceListing.slug}`
      : `/can-thue/${sourceListing.slug}`
    : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Quay lại"
            className="shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Button>

          <div className="min-w-0 space-y-1">
            <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
              Lead detail
            </p>
            <h1 className="text-heading text-xl font-semibold tracking-[-0.03em]">
              Lead #{lead.id}
            </h1>
          </div>
        </div>
      </header>

      <AdminLeadOverviewCards
        lead={lead}
        sourceCardLabel={sourceCardLabel}
        sourceListing={sourceListing ?? null}
        sourceListingHref={sourceListingHref}
        updating={updating}
        onStatusChange={handleStatusChange}
      />

      <AdminLeadMatchesSection
        candidates={candidates}
        source={source}
        sourceListingTitle={sourceListingTitle}
        counterpartTypeLabel={counterpartTypeLabel}
        updating={updating}
        onAddCandidate={() => setAddDialogOpen(true)}
        onPromote={handlePromote}
        onReject={handleReject}
        onUnmatch={handleUnmatch}
        onRemoveCandidate={handleRemoveCandidate}
      />

      <AdminLeadAddCandidateDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        leadId={leadId}
        source={source}
        onCreated={invalidate}
      />
    </div>
  );
}
