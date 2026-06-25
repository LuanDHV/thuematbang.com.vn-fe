export function appendString(formData: FormData, key: string, value?: string | null) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return;
  formData.set(key, normalizedValue);
}

export function appendNumber(formData: FormData, key: string, value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return;
  formData.set(key, String(value));
}

export function appendBoolean(formData: FormData, key: string, value?: boolean) {
  if (typeof value !== "boolean") return;
  formData.set(key, value ? "true" : "false");
}

export function appendNumberArray(
  formData: FormData,
  key: string,
  values?: number[],
) {
  if (!values?.length) return;
  formData.set(key, JSON.stringify(values));
}
