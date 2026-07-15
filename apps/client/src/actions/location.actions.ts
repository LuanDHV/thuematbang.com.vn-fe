'use server';

import { locationService } from "@/services/location.service";

export async function getProvincesAction() {
  return locationService.getProvinces();
}

export async function getProvinceWardsAction(provinceId?: number) {
  return locationService.getWards({ provinceId });
}
