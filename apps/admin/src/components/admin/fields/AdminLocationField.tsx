import { useEffect, useMemo, useState } from "react";
import { Form, Select, Spin } from "antd";
import { axiosInstance } from "../../../providers/auth/auth-client";

type Province = { id: number; name: string };
type Ward = { id: number; name: string };

type Props = {
  provinceName: string;
  wardName: string;
  provinceLabel?: string;
  wardLabel?: string;
  requiredProvince?: boolean;
  onLocationChange?: (provinceName: string | null, wardName: string | null) => void;
};

function unwrapArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as Record<string, unknown>).data)) {
    return (payload as Record<string, unknown>).data as T[];
  }
  return [];
}

export function AdminLocationField({ provinceName, wardName, provinceLabel = "Tỉnh/Thành", wardLabel = "Phường/Xã", requiredProvince = false, onLocationChange }: Props) {
  const form = Form.useFormInstance();
  const selectedProvinceId = Form.useWatch(provinceName, form);
  const selectedWardId = Form.useWatch(wardName, form);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [wardLoading, setWardLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setProvinceLoading(true);
    axiosInstance.get("/locations/provinces").then(({ data }) => { if (mounted) setProvinces(unwrapArray<Province>(data)); }).finally(() => { if (mounted) setProvinceLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const pid = Number(selectedProvinceId || 0);
    if (!pid) { setWards([]); form.setFieldValue(wardName, undefined); return; }
    setWardLoading(true);
    axiosInstance.get(`/locations/provinces/${pid}/wards`).then(({ data }) => { if (mounted) setWards(unwrapArray<Ward>(data)); }).finally(() => { if (mounted) setWardLoading(false); });
    return () => { mounted = false; };
  }, [form, selectedProvinceId, wardName]);

  useEffect(() => {
    if (!selectedProvinceId) return;
    const wardId = form.getFieldValue(wardName);
    if (wardId && !wards.some((w) => String(w.id) === String(wardId))) form.setFieldValue(wardName, undefined);
  }, [form, selectedProvinceId, wardName, wards]);

  const selectedProvince = useMemo(() => provinces.find((p) => String(p.id) === String(selectedProvinceId)), [provinces, selectedProvinceId]);
  const selectedWard = useMemo(() => wards.find((w) => String(w.id) === String(selectedWardId)), [wards, selectedWardId]);

  useEffect(() => {
    onLocationChange?.(selectedProvince?.name ?? null, selectedWard?.name ?? null);
  }, [selectedProvince?.name, selectedWard?.name, onLocationChange]);

  const provinceOptions = useMemo(() => provinces.map((p) => ({ label: p.name, value: p.id })), [provinces]);
  const wardOptions = useMemo(() => wards.map((w) => ({ label: w.name, value: w.id })), [wards]);

  return (
    <div className="admin-location-grid">
      <Form.Item label={provinceLabel} name={provinceName} rules={requiredProvince ? [{ required: true, message: "Vui lòng chọn tỉnh/thành" }] : undefined} className="admin-location-field">
        <Select allowClear placeholder="Chọn tỉnh/thành" loading={provinceLoading} options={provinceOptions} showSearch optionFilterProp="label" />
      </Form.Item>
      <Form.Item label={wardLabel} name={wardName} className="admin-location-field">
        <Select allowClear disabled={!selectedProvinceId} placeholder={selectedProvinceId ? "Chọn phường/xã" : "Chọn tỉnh/thành trước"} loading={wardLoading} options={wardOptions} showSearch optionFilterProp="label" notFoundContent={wardLoading ? <Spin size="small" /> : undefined} />
      </Form.Item>
    </div>
  );
}
