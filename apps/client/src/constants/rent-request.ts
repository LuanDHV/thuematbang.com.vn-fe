export const RENT_REQUEST_COVER_IMAGE = "/imgs/fallback.png";

const RENT_REQUEST_THUMBNAIL_BASE_PATH = "/imgs/rent-request-thumbnail";

export const RENT_REQUEST_CATEGORY_COVER_IMAGES: Record<string, string> = {
  "biet-thu": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/biet-thu.png`,
  "can-ho-chung-cu": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/can-ho-chung-cu.png`,
  "kho-xuong-khu-cong-nghiep": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/kho-xuong-khu-cong-nghiep.png`,
  "mat-bang": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/mat-bang.png`,
  "nha-tro-phong-tro": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/nha-tro-phong-tro.png`,
  "trung-tam-thuong-mai": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/trung-tam-thuong-mai.png`,
  "van-phong": `${RENT_REQUEST_THUMBNAIL_BASE_PATH}/van-phong.png`,
};

export function getRentRequestCoverImage(categorySlug?: string | null) {
  if (!categorySlug) return RENT_REQUEST_COVER_IMAGE;

  return (
    RENT_REQUEST_CATEGORY_COVER_IMAGES[categorySlug] ?? RENT_REQUEST_COVER_IMAGE
  );
}
