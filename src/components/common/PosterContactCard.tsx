"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, PhoneCall, X } from "lucide-react";

import { createPublicLeadAction } from "@/actions/lead.actions";
import CloudinaryImage from "@/components/common/CloudinaryImage";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuthMe } from "@/hooks/use-auth";
import {
  leadContactSchema,
  type LeadContactFormValues,
} from "@/schemas/lead-contact.schema";

type PosterContactCardProps = {
  fullName?: string | null;
  avatarUrl?: string | null;
  propertyId?: number | null;
  rentRequestId?: number | null;
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
  const { toast } = useToast();
  const [contactOpen, setContactOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!contactOpen) return;
    form.reset(defaultValues);
  }, [contactOpen, defaultValues, form]);

  const openContactDialog = () => {
    setSubmitError(null);
    setContactOpen(true);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const lead = await createPublicLeadAction({
        fullName: values.fullName,
        phone: values.phone,
        userId: currentUser?.id ?? null,
        propertyId: propertyId ?? null,
        rentRequestId: rentRequestId ?? null,
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
              fill
              sizes="48px"
              cldQuality="auto:good"
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
                ? "Thông tin từ tài khoản của bạn đã được điền sẵn. Bạn có thể chỉnh sửa trước khi gửi."
                : "Vui lòng nhập thông tin để chúng tôi liên hệ lại sớm nhất."}
            </DialogDescription>
          </DialogHeader>

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

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
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
    </section>
  );
}
