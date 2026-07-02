"use client";

import { useState } from "react";

import {
  createListingMatchAction,
  getLeadAction,
} from "@/actions/listing-match.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { LeadSourceFilter } from "@/types/lead";

type AdminLeadAddCandidateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: number;
  source: LeadSourceFilter;
  onCreated: () => void;
};

export default function AdminLeadAddCandidateDialog({
  open,
  onOpenChange,
  leadId,
  source,
  onCreated,
}: AdminLeadAddCandidateDialogProps) {
  const { toast } = useToast();
  const [counterpartId, setCounterpartId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    const id = Number(counterpartId);
    if (!id || id <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const lead = await getLeadAction(leadId);
      if (source === "PROPERTY" && lead.propertyId) {
        await createListingMatchAction({
          propertyId: lead.propertyId,
          rentRequestId: id,
          leadId,
        });
      } else if (source === "RENT_REQUEST" && lead.rentRequestId) {
        await createListingMatchAction({
          propertyId: id,
          rentRequestId: lead.rentRequestId,
          leadId,
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Lead không có listing nguồn để tạo đề xuất.",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Đã thêm đề xuất", variant: "success" });
      setCounterpartId("");
      onOpenChange(false);
      onCreated();
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error instanceof Error ? error.message : "Không thể thêm đề xuất.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm đề xuất</DialogTitle>
          <DialogDescription>
            Nhập ID của tin đối ứng để tạo một đề xuất mới cho lead này.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              ID {source === "PROPERTY" ? "tin cần thuê" : "tin cho thuê"}
            </Label>
            <Input
              type="number"
              min={1}
              value={counterpartId}
              onChange={(event) => setCounterpartId(event.target.value)}
              placeholder="Nhập ID..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Huỷ
            </Button>
            <Button onClick={handleAdd} disabled={submitting}>
              {submitting ? "Đang thêm..." : "Thêm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
