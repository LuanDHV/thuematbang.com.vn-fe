"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PhoneCall } from "lucide-react";

import {
  createPublicLeadAction,
  getMyEligiblePropertiesAction,
  getMyEligibleRentRequestsAction,
} from "@/actions/lead.actions";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import PosterContactCardEligibleListings from "@/components/common/PosterContactCardEligibleListings";
import PosterContactCardSuccessDialog from "@/components/common/PosterContactCardSuccessDialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/track-event";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthMe } from "@/hooks/use-auth";
import {
  leadContactSchema,
  type LeadContactFormValues,
} from "@/schemas/lead-contact.schema";
import type { DealCaseUpsertPayload } from "@/services/lead.service";

type PosterContactCardProps = {
  fullName?: string | null;
  avatarUrl?: string | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
};

type EligibleListing = {
  id: number;
  title: string;
  displayCode?: string | null;
};

function getInitials(name?: string | null) {
  if (!name) return "ND";
  const words = name.trim().split(/\s+/).slice(-2);
  return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

export default function PosterContactCard({
  fullName,
  avatarUrl,
  propertyId,
  rentRequestId,
}: PosterContactCardProps) {
  const { data: currentUser } = useAuthMe();
  const pathname = usePathname();
  const { toast } = useToast();
  const [contactOpen, setContactOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [eligibleListings, setEligibleListings] = useState<
    EligibleListing[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const isAuthenticated = Boolean(currentUser);
  const loginHref = `/dang-nhap?from=${encodeURIComponent(pathname || "/")}`;
  const sourceIsProperty = Boolean(propertyId);
  const sourceIsRentRequest = Boolean(rentRequestId);
  const contactTrackingParams = {
    listing_type: sourceIsProperty ? "property" : "rent_request",
    property_id: propertyId ?? null,
    rent_request_id: rentRequestId ?? null,
    is_authenticated: isAuthenticated,
  };

  const defaultValues = useMemo<LeadContactFormValues>(
    () => ({
      fullName: currentUser?.fullName ?? "",
      phone: currentUser?.phone ?? "",
    }),
    [currentUser?.fullName, currentUser?.phone],
  );

  const form = useForm<LeadContactFormValues>({
    resolver: zodResolver(leadContactSchema) as never,
    defaultValues,
    mode: "onSubmit",
  });

  const fetchEligibleListings = useCallback(async () => {
    if (!isAuthenticated) {
      setEligibleListings([]);
      return;
    }

    setLoadingListings(true);
    try {
      if (sourceIsProperty) {
        const listings = await getMyEligibleRentRequestsAction();
        setEligibleListings(
          (listings ?? []).map((item: EligibleListing) => ({
            id: item.id,
            title: item.title,
            displayCode: item.displayCode,
          })),
        );
      } else if (sourceIsRentRequest) {
        const listings = await getMyEligiblePropertiesAction();
        setEligibleListings(
          (listings ?? []).map((item: EligibleListing) => ({
            id: item.id,
            title: item.title,
            displayCode: item.displayCode,
          })),
        );
      }
    } catch {
      setEligibleListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, [isAuthenticated, sourceIsProperty, sourceIsRentRequest]);

  const toggleId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (!contactOpen) return;
    form.reset(defaultValues);
  }, [contactOpen, defaultValues, form]);

  const openContactDialog = () => {
    trackEvent(ANALYTICS_EVENTS.clickContact, {
      ...contactTrackingParams,
      source: "poster_contact_card",
    });
    setSubmitError(null);
    setSelectedIds([]);
    setEligibleListings([]);
    form.reset(defaultValues);
    setContactOpen(true);
    void fetchEligibleListings();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    trackEvent(ANALYTICS_EVENTS.contactFormSubmitClicked, {
      ...contactTrackingParams,
      selected_listing_count: selectedIds.length,
    });

    try {
      const payload: DealCaseUpsertPayload = {
        fullName: values.fullName,
        phone: values.phone,
        userId: currentUser?.id ?? null,
        propertyId: propertyId ?? null,
        rentRequestId: rentRequestId ?? null,
      };

      if (selectedIds.length > 0) {
        if (sourceIsProperty) {
          payload.selectedRentRequestIds = selectedIds;
        } else if (sourceIsRentRequest) {
          payload.selectedPropertyIds = selectedIds;
        }
      }

      const lead = await createPublicLeadAction(payload);
      trackEvent(ANALYTICS_EVENTS.contactFormCompleted, {
        ...contactTrackingParams,
        selected_listing_count: selectedIds.length,
      });

      setSubmittedPhone(lead.phone || values.phone);
      setContactOpen(false);
      setSuccessOpen(true);
      form.reset(defaultValues);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể gửi thông tin liên hệ.";
      setSubmitError(message);
      trackEvent(ANALYTICS_EVENTS.contactFormFailed, {
        ...contactTrackingParams,
        selected_listing_count: selectedIds.length,
        reason: "api_error",
      });
      toast({
        title: "Không thể gửi thông tin liên hệ",
        description: message,
        variant: "destructive",
      });
    }
  });

  return (
    <section>
      <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
        Thông tin người đăng
      </h2>

      <div className="mt-4 flex items-center gap-3">
        {avatarUrl ? (
          <div className="ring-hairline relative h-12 w-12 overflow-hidden rounded-full ring-1">
            <CloudinaryImage
              src={avatarUrl}
              alt={fullName || "Người đăng"}
              cloudinaryPreset="avatar"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-accent-soft text-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
            {getInitials(fullName)}
          </div>
        )}
        <div>
          <p className="text-secondary text-sm">Người đăng</p>
          <p className="text-heading text-base font-semibold">
            {fullName || "Đang cập nhật"}
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={openContactDialog}
        className="bg-primary mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-card) transition-[filter] hover:brightness-[1.02]"
      >
        <PhoneCall size={16} />
        Liên hệ
      </Button>

      <PosterContactCardSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        submittedPhone={submittedPhone}
        showGuestLoginCta={!isAuthenticated}
        loginHref={loginHref}
      />

      <Dialog
        open={contactOpen}
        onOpenChange={(open) => {
          setContactOpen(open);
          if (!open) setSubmitError(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Gửi thông tin liên hệ</DialogTitle>
            <DialogDescription>
              {currentUser
                ? "Thông tin từ tài khoản của bạn đã được điền sẵn."
                : "Bạn có thể gửi nhanh bằng số điện thoại, hoặc đăng nhập để tự điền thông tin lần sau."}
            </DialogDescription>
          </DialogHeader>

          {!isAuthenticated ? (
            <div className="border-hairline bg-accent-soft/40 text-secondary rounded-2xl border px-4 py-3 text-sm leading-6">
              Đã có tài khoản?{" "}
              <Link
                href={loginHref}
                className="text-primary font-semibold underline-offset-4 hover:underline"
              >
                Đăng nhập để gửi nhanh hơn
              </Link>
            </div>
          ) : null}

          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup className="space-y-4">
                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="fullName"
                    className="text-heading font-semibold"
                  >
                    Họ và tên
                  </FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="Nhập họ và tên"
                    autoComplete="name"
                    {...form.register("fullName")}
                  />
                  <FieldError>
                    {form.formState.errors.fullName?.message}
                  </FieldError>
                </Field>

                <Field className="flex flex-col gap-2">
                  <FieldLabel
                    htmlFor="phone"
                    className="text-heading font-semibold"
                  >
                    Số điện thoại
                  </FieldLabel>
                  <Input
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    autoComplete="tel"
                    inputMode="tel"
                    {...form.register("phone")}
                  />
                  <FieldError>
                    {form.formState.errors.phone?.message}
                  </FieldError>
                </Field>
              </FieldGroup>

              <PosterContactCardEligibleListings
                isAuthenticated={isAuthenticated}
                sourceIsProperty={sourceIsProperty}
                loadingListings={loadingListings}
                eligibleListings={eligibleListings}
                selectedIds={selectedIds}
                onToggleId={toggleId}
              />

              {submitError ? (
                <p className="text-destructive text-sm">{submitError}</p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setContactOpen(false)}
                  className="sm:w-auto"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="sm:w-auto"
                >
                  {form.formState.isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </section>
  );
}
