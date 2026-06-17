"use server";

import { toPositiveId } from "@/lib/form/form-normalize";
import { refreshCrudTags } from "@/lib/server/revalidate";
import { propertyService } from "@/services/property.service";

export async function deletePropertyAction(id: string | number) {
  const propertyId = toPositiveId(id);
  await propertyService.remove(propertyId);

  // Keep admin listing fresh after destructive mutations.
  refreshCrudTags(["properties", "my-properties"], [
    "/admin/quan-li-tin-cho-thue",
  ]);
}

export async function updatePropertyAction(
  id: string | number,
  payload: Parameters<typeof propertyService.update>[1],
) {
  const propertyId = toPositiveId(id);
  const result = await propertyService.update(propertyId, payload);

  // Update mutations should refresh both the admin list and the edit page shell.
  refreshCrudTags(["properties", "my-properties", "property-detail"], [
    "/admin/quan-li-tin-cho-thue",
    `/admin/quan-li-tin-cho-thue/${propertyId}`,
    `/admin/quan-li-tin-cho-thue/${propertyId}/edit`,
  ]);
  return result;
}
