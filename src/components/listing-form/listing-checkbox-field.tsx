"use client";

import { useFormContext } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

type ListingCheckboxFieldProps = {
  name: string;
  label: string;
  description?: string;
  className?: string;
  required?: boolean;
};

export function ListingCheckboxField({
  name,
  label,
  description,
  className,
  required = false,
}: ListingCheckboxFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <Field className={cn("flex cursor-pointer flex-col gap-2", className)}>
      <div className="rounded-xl border border-black/8 bg-white px-4 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <label htmlFor={name} className="flex cursor-pointer items-start gap-3">
          <input
            id={name}
            type="checkbox"
            className="accent-primary text-primary focus:ring-primary/12 mt-1 h-4 w-4 shrink-0 rounded border-black/20 shadow-sm focus:ring-4"
            {...register(name)}
          />
          <div className="flex flex-1 flex-col gap-1">
            <FieldLabel htmlFor={name} className="border-0 p-0 tracking-normal">
              <span>{label}</span>
              {required ? <span className="text-destructive">*</span> : null}
            </FieldLabel>
            {description ? (
              <div className="text-secondary text-sm leading-normal font-normal">
                {description}
              </div>
            ) : null}
          </div>
        </label>
      </div>
      <FieldError>{error?.message as string | undefined}</FieldError>
    </Field>
  );
}
