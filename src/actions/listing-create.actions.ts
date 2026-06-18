"use server";

import { refreshCrudTags } from "@/lib/server/revalidate";
import { propertyService } from "@/services/property.service";
import {
  rentRequestService,
  type RentRequestUpsertPayload,
} from "@/services/rent-request.service";

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

export async function createRentRequestAction(
  payload: RentRequestUpsertPayload,
) {
  const result = await rentRequestService.create(payload);

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
