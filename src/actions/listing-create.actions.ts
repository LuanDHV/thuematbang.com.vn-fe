"use server";

import { refreshCrudTags } from "@/lib/server/revalidate";
import { normalizeRentRequestPayload } from "@/lib/form/form-normalize";
import { propertyService } from "@/services/property.service";
import { rentRequestService } from "@/services/rent-request.service";

export async function createPropertyAction(payload: Parameters<typeof propertyService.create>[0]) {
  const result = await propertyService.create(payload);

  refreshCrudTags(
    ["properties", "my-properties"],
    [
      "/cho-thue",
      "/dang-tin/cho-thue",
      "/quan-li-tai-khoan/cho-thue",
      "/admin/quan-li-tin-cho-thue",
    ],
  );

  return result;
}

export async function createRentRequestAction(formData: FormData) {
  const result = await rentRequestService.create(
    normalizeRentRequestPayload(formData),
  );

  refreshCrudTags(
    ["rent-requests", "my-rent-requests"],
    [
      "/can-thue",
      "/dang-tin/can-thue",
      "/quan-li-tai-khoan/cau-thue",
      "/admin/quan-li-tin-can-thue",
    ],
  );

  return result;
}
