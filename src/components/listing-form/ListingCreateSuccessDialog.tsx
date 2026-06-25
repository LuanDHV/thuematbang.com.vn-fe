"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ListingCreateSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
};

export function ListingCreateSuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
}: ListingCreateSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="overflow-visible border-0 bg-transparent p-0 shadow-none sm:max-w-sm"
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <div className="mx-auto w-full rounded-3xl border border-hairline bg-surface px-6 py-8 text-center shadow-2xl">
          <div className="mb-5 flex justify-center">
            <div className="bg-primary flex size-20 items-center justify-center rounded-full text-white">
              <Check className="size-9" strokeWidth={3} />
            </div>
          </div>

          <DialogHeader className="gap-3 text-center">
            <DialogTitle className="text-heading text-2xl font-semibold tracking-[-0.03em]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-secondary mx-auto max-w-xs text-sm leading-6">
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full border-primary/20 bg-accent-soft text-primary shadow-lg hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent-soft hover:text-primary"
            >
              <Link href={primaryActionHref}>{primaryActionLabel}</Link>
            </Button>
            <Button
              asChild
              className="h-11 w-full bg-primary text-white shadow-lg hover:-translate-y-0.5 hover:bg-primary/90"
            >
              <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
