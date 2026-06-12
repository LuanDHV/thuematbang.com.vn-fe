import { notFound } from "next/navigation";

import { updatePropertyAction } from "@/actions/property.actions";
import CmsFormPageShell from "@/components/cms/shared/CmsFormPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { propertyService } from "@/services/property.service";
import type {
  PropertyPriority,
  PublishSource,
  PublishStatus,
} from "@/types/enums";

type PageProps = {
  params: Promise<{ id: string }>;
};

const PROPERTY_PRIORITY_OPTIONS: PropertyPriority[] = [
  "FREE",
  "STANDARD",
  "PREMIUM",
];
const PUBLISH_SOURCE_OPTIONS: PublishSource[] = ["FREE_QUOTA", "PAID_PACKAGE"];
const PUBLISH_STATUS_OPTIONS: PublishStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <label className="space-y-2">
      <span className="text-heading text-sm font-medium">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="text-body focus-visible:ring-primary/12 focus-visible:border-primary/25 h-11 w-full rounded-lg border border-black/8 bg-white px-3.5 py-2 text-sm transition-all outline-none focus-visible:ring-4"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default async function AdminPropertyEditPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    notFound();
  }

  let property;
  try {
    property = await propertyService.getById(propertyId);
  } catch {
    notFound();
  }

  return (
    <CmsFormPageShell>
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <h1 className="text-heading text-lg font-semibold tracking-[-0.02em]">
            Chỉnh sửa property #{property.id}
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Form tối thiểu để cập nhật dữ liệu chính, submit qua server action.
          </p>
        </div>

        <form
          action={updatePropertyAction.bind(null, property.id)}
          className="space-y-5 p-4 md:p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-heading text-sm font-medium">Title</span>
              <Input name="title" defaultValue={property.title} />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-heading text-sm font-medium">Slug</span>
              <Input name="slug" defaultValue={property.slug} />
            </label>

            <label className="space-y-2">
              <span className="text-heading text-sm font-medium">
                Category ID
              </span>
              <Input
                type="number"
                name="categoryId"
                defaultValue={property.categoryId}
              />
            </label>

            <label className="space-y-2">
              <span className="text-heading text-sm font-medium">Price</span>
              <Input
                type="number"
                name="price"
                defaultValue={property.price ?? ""}
              />
            </label>

            <label className="space-y-2">
              <span className="text-heading text-sm font-medium">Area</span>
              <Input
                type="number"
                name="area"
                defaultValue={property.area ?? ""}
              />
            </label>

            <label className="space-y-2">
              <span className="text-heading text-sm font-medium">
                Contact name
              </span>
              <Input
                name="contactName"
                defaultValue={property.contactName ?? ""}
              />
            </label>

            <label className="space-y-2">
              <span className="text-heading text-sm font-medium">
                Contact phone
              </span>
              <Input
                name="contactPhone"
                defaultValue={property.contactPhone ?? ""}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-heading text-sm font-medium">Content</span>
              <Textarea name="content" defaultValue={property.content ?? ""} />
            </label>

            <SelectField
              label="Priority status"
              name="priorityStatus"
              defaultValue={property.priorityStatus}
              options={PROPERTY_PRIORITY_OPTIONS}
            />

            <SelectField
              label="Publish source"
              name="publishSource"
              defaultValue={property.publishSource}
              options={PUBLISH_SOURCE_OPTIONS}
            />

            <SelectField
              label="Status"
              name="status"
              defaultValue={property.status}
              options={PUBLISH_STATUS_OPTIONS}
            />

            <label className="border-hairline bg-subtle/50 flex items-center gap-3 rounded-xl border px-4 py-3">
              <input type="hidden" name="isNegotiable" value="false" />
              <input
                type="checkbox"
                name="isNegotiable"
                value="true"
                defaultChecked={property.isNegotiable}
                className="border-hairline text-primary focus:ring-primary/15 size-4 rounded"
              />
              <span className="text-heading text-sm font-medium">
                Is negotiable
              </span>
            </label>

            <label className="border-hairline bg-subtle/50 flex items-center gap-3 rounded-xl border px-4 py-3">
              <input type="hidden" name="isFeatured" value="false" />
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={property.isFeatured}
                className="border-hairline text-primary focus:ring-primary/15 size-4 rounded"
              />
              <span className="text-heading text-sm font-medium">
                Is featured
              </span>
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="submit">Lưu thay đổi</Button>
          </div>
        </form>
      </div>
    </CmsFormPageShell>
  );
}
