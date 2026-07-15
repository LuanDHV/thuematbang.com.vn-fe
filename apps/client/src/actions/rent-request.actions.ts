"use server";

import { toPositiveId } from "@/lib/form/form-normalize";
import { refreshCrudTags } from "@/lib/server/revalidate";
import { rentRequestService } from "@/services/rent-request.service";
import type { RentRequestUpsertPayload } from "@/services/rent-request.service";

export async function updateRentRequestAction(
  id: string | number,
  payload: Partial<RentRequestUpsertPayload>,
) {
  const rentRequestId = toPositiveId(id);
  const result = await rentRequestService.update(rentRequestId, payload);
  refreshCrudTags(
    ["rent-requests", "rent-request-detail", "my-rent-requests"],
    ["/quan-li-tai-khoan/can-thue"],
  );
  return result;
}
