"use server";

import { toPositiveId } from "@/lib/form/form-normalize";
import { refreshCrudTags } from "@/lib/server/revalidate";
import { propertyService } from "@/services/property.service";

export async function deletePropertyAction(id: string | number) {
  const propertyId = toPositiveId(id);
  await propertyService.remove(propertyId);

  refreshCrudTags(["properties", "my-properties"], [
    "/quan-li-tai-khoan/cho-thue",
  ]);
}

export async function updatePropertyAction(
  id: string | number,
  payload: Parameters<typeof propertyService.update>[1],
) {
  const propertyId = toPositiveId(id);
  const result = await propertyService.update(propertyId, payload);

  refreshCrudTags(["properties", "my-properties", "property-detail"], [
    "/quan-li-tai-khoan/cho-thue",
    `/quan-li-tai-khoan/cho-thue/${propertyId}`,
  ]);
  return result;
}
