"use client";

import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="gap-3">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-7">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3 sm:justify-between">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={primaryActionHref}>{primaryActionLabel}</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
