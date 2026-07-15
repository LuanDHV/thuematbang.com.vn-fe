"use client";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PosterContactCardSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submittedPhone: string;
};

export default function PosterContactCardSuccessDialog({
  open,
  onOpenChange,
  submittedPhone,
}: PosterContactCardSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-md"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="border-hairline bg-surface relative mx-auto w-full rounded-3xl border px-6 py-7 shadow-2xl">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-secondary hover:bg-accent-soft hover:text-heading absolute top-3 right-3"
            >
              <X className="size-4" />
              <span className="sr-only">Đóng</span>
            </Button>
          </DialogClose>

          <div className="mb-5 flex justify-center">
            <div className="bg-primary flex size-16 items-center justify-center rounded-full text-white shadow-lg">
              <Check className="size-8" strokeWidth={3} />
            </div>
          </div>

          <DialogHeader className="gap-2 text-center">
            <DialogTitle className="text-heading text-2xl font-semibold tracking-[-0.03em]">
              Đã nhận thông tin
            </DialogTitle>
            <DialogDescription className="text-secondary mx-auto max-w-sm text-sm leading-6">
              Chúng tôi đã nhận được thông tin và sẽ liên hệ lại qua số điện
              thoại <strong className="text-primary">{submittedPhone}</strong>{" "}
              trong thời gian sớm nhất.
            </DialogDescription>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
}
