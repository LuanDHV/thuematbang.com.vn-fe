type CloudinaryResizeMode = "fill" | "fit" | "limit" | "crop";

type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:good" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  mode?: CloudinaryResizeMode;
};

type CloudinaryPresetName =
  | "avatarSm"
  | "avatarMd"
  | "avatarLg"
  | "listingCard"
  | "listingGalleryMain"
  | "listingGalleryThumb";

const CLOUDINARY_HOST = "res.cloudinary.com";
const IMAGE_UPLOAD_SEGMENT = "/image/upload/";
const WATERMARK_TRANSFORM = "t_watermark_v1";

// Round transform inputs to the positive integers expected by Cloudinary.
function toInteger(value?: number) {
  if (!value) return undefined;
  const rounded = Math.round(value);
  return rounded > 0 ? rounded : undefined;
}

function prependCloudinaryTransforms(rawUrl: string, transforms: string[]) {
  if (!rawUrl) return rawUrl;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (parsed.hostname !== CLOUDINARY_HOST) return rawUrl;

  const uploadIndex = parsed.pathname.indexOf(IMAGE_UPLOAD_SEGMENT);
  if (uploadIndex === -1) return rawUrl;

  const prefix = parsed.pathname.slice(
    0,
    uploadIndex + IMAGE_UPLOAD_SEGMENT.length,
  );
  const suffix = parsed.pathname.slice(
    uploadIndex + IMAGE_UPLOAD_SEGMENT.length,
  );

  if (suffix.startsWith(`${WATERMARK_TRANSFORM}/`)) {
    return rawUrl;
  }

  const transformPath = transforms.filter(Boolean).join("/");
  parsed.pathname = `${prefix}${transformPath}/${suffix}`;

  return parsed.toString();
}

export function applyCloudinaryWatermark(rawUrl: string) {
  return prependCloudinaryTransforms(rawUrl, [WATERMARK_TRANSFORM]);
}

// Inject responsive optimization transforms into one Cloudinary delivery URL.
export function optimizeCloudinaryImage(
  rawUrl: string,
  options: CloudinaryImageOptions = {},
) {
  if (!rawUrl) return rawUrl;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (parsed.hostname !== CLOUDINARY_HOST) return rawUrl;

  const uploadIndex = parsed.pathname.indexOf(IMAGE_UPLOAD_SEGMENT);
  if (uploadIndex === -1) return rawUrl;

  const mode = options.mode ?? "fill";
  const quality = options.quality ?? "auto:good";
  const format = options.format ?? "auto";
  const width = toInteger(options.width);
  const height = toInteger(options.height);

  const transforms = [
    WATERMARK_TRANSFORM,
    `f_${format}`,
    `q_${quality}`,
    width ? `w_${width}` : null,
    height ? `h_${height}` : null,
    width || height ? `c_${mode}` : null,
    "g_auto",
  ]
    .filter(Boolean)
    .join(",");

  const prefix = parsed.pathname.slice(
    0,
    uploadIndex + IMAGE_UPLOAD_SEGMENT.length,
  );
  const suffix = parsed.pathname.slice(
    uploadIndex + IMAGE_UPLOAD_SEGMENT.length,
  );
  if (suffix.startsWith(`${WATERMARK_TRANSFORM}/`)) {
    const remainder = suffix.slice(WATERMARK_TRANSFORM.length + 1);
    parsed.pathname = `${prefix}${WATERMARK_TRANSFORM}/${transforms}/${remainder}`;
    return parsed.toString();
  }

  parsed.pathname = `${prefix}${transforms}/${suffix}`;

  return parsed.toString();
}

// Detect whether one URL points to a Cloudinary image upload resource.
export function isCloudinaryImageUrl(rawUrl?: string | null) {
  if (!rawUrl) return false;

  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.hostname === CLOUDINARY_HOST &&
      parsed.pathname.includes(IMAGE_UPLOAD_SEGMENT)
    );
  } catch {
    return false;
  }
}

// Extract the public id portion from one Cloudinary delivery URL.
export function getCloudinaryPublicId(rawUrl: string) {
  if (!isCloudinaryImageUrl(rawUrl)) return null;

  const parsed = new URL(rawUrl);
  const afterUpload = parsed.pathname.split(IMAGE_UPLOAD_SEGMENT)[1];
  if (!afterUpload) return null;

  const segments = afterUpload.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
  const assetSegments =
    versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(1);

  if (assetSegments.length === 0) return null;

  const publicIdWithExt = assetSegments.join("/");
  return publicIdWithExt.replace(/\.[^/.]+$/, "");
}

const CLOUDINARY_PRESETS: Record<CloudinaryPresetName, CloudinaryImageOptions> =
  {
    avatarSm: { width: 96, height: 96, quality: "auto:good" },
    avatarMd: { width: 176, height: 176, quality: "auto:good" },
    avatarLg: { width: 192, height: 192, quality: "auto:good" },
    listingCard: { width: 1200, height: 760, quality: "auto:good" },
    listingGalleryMain: { width: 1600, height: 1000, quality: "auto:good" },
    listingGalleryThumb: { width: 220, height: 140, quality: "auto:good" },
  };

// Apply one named Cloudinary preset while still allowing per-call overrides.
export function optimizeCloudinaryByPreset(
  rawUrl: string,
  preset: CloudinaryPresetName,
  overrides?: CloudinaryImageOptions,
) {
  return optimizeCloudinaryImage(rawUrl, {
    ...CLOUDINARY_PRESETS[preset],
    ...overrides,
  });
}
