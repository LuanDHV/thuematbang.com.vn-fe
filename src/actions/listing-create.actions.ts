"use server";

import { refreshCrudTags } from "@/lib/server/revalidate";
import { propertyService } from "@/services/property.service";
import {
  rentRequestService,
  type RentRequestUpsertPayload,
} from "@/services/rent-request.service";

export async function createPropertyAction(payload: Parameters<typeof propertyService.create>[0]) {
  const result = await propertyService.create(payload);

  // Keep tag invalidation so list views can refetch, but avoid path revalidation
  // here because it can refresh the current create page and drop the success modal
  // before the client sees it in E2E.
  refreshCrudTags(["properties", "my-properties"]);

  return result;
}

export async function createRentRequestAction(
  payload: RentRequestUpsertPayload,
) {
  const result = await rentRequestService.create(payload);

  // Same rationale as createPropertyAction: avoid path refreshes that can
  // re-render the current page before the success dialog is observable.
  refreshCrudTags(["rent-requests", "my-rent-requests"]);

  return result;
}
