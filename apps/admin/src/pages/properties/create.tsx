import React, { useMemo, useState } from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { compactSlugToken } from "@thuematbang/contracts";
import { Card, Col, Form, Input, InputNumber, Row, Select, Switch } from "antd";

import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import { AdminLocationField } from "../../components/admin/fields/AdminLocationField";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
import { buildGoogleMapEmbedSrc, buildMapQuery } from "../../lib/google-map";
import {
  LISTING_STATUS_OPTIONS,
  PRICE_UNIT_OPTIONS,
  PROPERTY_DIRECTION_OPTIONS,
  PROPERTY_PRIORITY_OPTIONS,
  PUBLISH_SOURCE_OPTIONS,
} from "../../lib/admin/constants/options";
import { type AdminGalleryImage } from "../../lib/admin/media";

function buildImagePayload(images: AdminGalleryImage[]) {
  return images
    .filter((image) => !image.persisted)
    .map((image) => ({
      imageUrl: image.imageUrl,
      imagePublicId: image.imagePublicId,
      width: image.width ?? null,
      height: image.height ?? null,
      bytes: image.bytes ?? null,
    }));
}

export const PropertiesCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();
  const { selectProps: catProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "PROPERTY" }],
  });

  const [galleryImages, setGalleryImages] = useState<AdminGalleryImage[]>([]);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [locProvince, setLocProvince] = useState<string | null>(null);
  const [locWard, setLocWard] = useState<string | null>(null);
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const form = formProps.form;
  const titleValue = Form.useWatch("title", form);

  const generatedSlug = useMemo(
    () => compactSlugToken(String(titleValue ?? "")).slice(0, 120),
    [titleValue]
  );

  const handleFinish = async (values: Record<string, unknown>) => {
    if (galleryBusy) {
      setGalleryError("Vui lòng đợi ảnh tải xong trước khi lưu.");
      return;
    }

    if (galleryImages.length < 1) {
      setGalleryError("Vui lòng thêm ít nhất một ảnh cho tin đăng.");
      return;
    }

    const payload = {
      ...values,
      slug: generatedSlug,
      area: values.area ? Number(values.area) : undefined,
      priceAmount: values.priceAmount ? Number(values.priceAmount) : undefined,
      priceUnit: values.priceUnit || undefined,
      bedrooms: values.bedrooms != null ? Number(values.bedrooms) : undefined,
      bathrooms:
        values.bathrooms != null ? Number(values.bathrooms) : undefined,
      floors: values.floors != null ? Number(values.floors) : undefined,
      direction: values.direction || undefined,
      provinceId: values.provinceId ? Number(values.provinceId) : undefined,
      wardId: values.wardId ? Number(values.wardId) : undefined,
      longitude:
        values.longitude != null ? Number(values.longitude) : undefined,
      latitude: values.latitude != null ? Number(values.latitude) : undefined,
      isNegotiable: Boolean(values.isNegotiable),
      isBoosted: Boolean(values.isBoosted),
      isMatched: Boolean(values.isMatched),
      boostCount: values.boostCount != null ? Number(values.boostCount) : 0,
      priorityStatus: values.priorityStatus || "FREE",
      publishSource: values.publishSource || "FREE_QUOTA",
      status: values.status || "PENDING",
      content: String(values.content ?? ""),
      images: buildImagePayload(galleryImages),
    };

    setGalleryError(null);
    onFinish?.(payload);
  };

  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Card title="Liên hệ" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên liên hệ"
                name="contactName"
                rules={[{ required: true, message: "Nhập tên người liên hệ" }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="SĐT liên hệ"
                name="contactPhone"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input placeholder="09xxxxxxxx" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông tin đăng" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Nhập tiêu đề tin đăng" }]}
              >
                <Input placeholder="VD: Cho thuê mặt bằng Quận 1..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Slug">
                <Input
                  value={generatedSlug}
                  disabled
                  placeholder="Hệ thống sẽ tự tạo slug từ tiêu đề"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select {...catProps} placeholder="Chọn danh mục" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nguồn đăng tin"
                name="publishSource"
                initialValue="FREE_QUOTA"
              >
                <Select options={PUBLISH_SOURCE_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Thương lượng"
                name="isNegotiable"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(pv, cv) => pv.isNegotiable !== cv.isNegotiable}
            >
              {({ getFieldValue }) =>
                getFieldValue("isNegotiable") ? null : (
                  <Col span={9}>
                    <Form.Item
                      label="Giá thuê"
                      name="priceAmount"
                      rules={[{ required: true, message: "Nhập giá thuê" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="10000000"
                        formatter={(v) =>
                          `${v ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                      />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(pv, cv) => pv.isNegotiable !== cv.isNegotiable}
            >
              {({ getFieldValue }) =>
                getFieldValue("isNegotiable") ? null : (
                  <Col span={9}>
                    <Form.Item
                      label="Đơn vị giá"
                      name="priceUnit"
                      initialValue="MILLION"
                    >
                      <Select options={PRICE_UNIT_OPTIONS} />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
          </Row>
        </Card>

        <Card title="Thông tin mặt bằng" style={{ marginBottom: 16 }}>
          <div className="admin-form-grid">
            <Form.Item
              className="admin-form-grid__half"
              label="Diện tích (m²)"
              name="area"
              rules={[{ required: true, message: "Nhập diện tích" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="50" />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Hướng"
              name="direction"
            >
              <Select
                allowClear
                placeholder="Chọn hướng"
                options={PROPERTY_DIRECTION_OPTIONS}
              />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__quarter"
              label="Số phòng ngủ"
              name="bedrooms"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__quarter"
              label="Số phòng tắm"
              name="bathrooms"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Số tầng"
              name="floors"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </Card>

        <Card title="Vị trí & địa chỉ" style={{ marginBottom: 16 }}>
          <AdminLocationField
            provinceName="provinceId"
            wardName="wardId"
            requiredProvince
            onLocationChange={(p, w) => {
              setLocProvince(p);
              setLocWard(w);
            }}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Địa chỉ chi tiết" name="addressDetail">
                <Input.TextArea rows={5} placeholder="Số nhà, tên đường..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vĩ độ" name="latitude">
                <InputNumber step={0.000001} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Kinh độ" name="longitude">
                <InputNumber step={0.000001} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            noStyle
            shouldUpdate={(pv, cv) =>
              pv.latitude !== cv.latitude ||
              pv.longitude !== cv.longitude ||
              pv.addressDetail !== cv.addressDetail
            }
          >
            {({ getFieldValue }) => {
              const lat = getFieldValue("latitude");
              const lng = getFieldValue("longitude");
              const addr = getFieldValue("addressDetail");
              const mapSrc = buildGoogleMapEmbedSrc({
                latitude: lat,
                longitude: lng,
                query: buildMapQuery([addr, locWard, locProvince, "Vietnam"]),
              });

              if (!mapSrc) {
                return (
                  <div
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#999",
                      border: "1px dashed #d9d9d9",
                      borderRadius: 8,
                    }}
                  >
                    Chọn tỉnh/thành hoặc nhập vĩ độ/kinh độ để xem bản đồ
                  </div>
                );
              }

              return (
                <iframe
                  title="map"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: 8 }}
                  src={mapSrc}
                />
              );
            }}
          </Form.Item>
        </Card>

        <Card title="Mô tả chi tiết" style={{ marginBottom: 16 }}>
          <Form.Item label="Mô tả thêm" name="content" initialValue="">
            <AdminRichTextEditor
              placeholder="Nhập mô tả chi tiết..."
              imageUpload={{ resourceType: "properties", draftId }}
            />
          </Form.Item>
        </Card>

        <Card title="Trạng thái & duyệt" style={{ marginBottom: 16 }}>
          <div className="admin-form-grid">
            <Form.Item
              className="admin-form-grid__half"
              label="Trạng thái"
              name="status"
              initialValue="PENDING"
            >
              <Select options={LISTING_STATUS_OPTIONS} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Loại tin đăng"
              name="priorityStatus"
              initialValue="FREE"
            >
              <Select options={PROPERTY_PRIORITY_OPTIONS} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Số lần boost"
              name="boostCount"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <div className="admin-setting-row admin-form-grid__half">
              <Form.Item
                label="Đã boost"
                name="isBoosted"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
              <Form.Item
                label="Đã khớp nhu cầu"
                name="isMatched"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.status !== cur.status}
          >
            {({ getFieldValue }) =>
              getFieldValue("status") === "REJECTED" ? (
                <Form.Item
                  label="Lý do từ chối"
                  name="rejectReason"
                  rules={[
                    { required: true, message: "Vui lòng nhập lý do từ chối" },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Nhập lý do để chủ tin chỉnh sửa..."
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Card>

        <Card title="Hình ảnh">
          <AdminGalleryField
            value={galleryImages}
            onChange={setGalleryImages}
            error={galleryError}
            onBusyChange={setGalleryBusy}
            resourceType="properties"
            draftId={draftId}
            maxFiles={25}
            description="Ít nhất 1 ảnh. Có thể thay đổi thứ tự ảnh sau khi tải lên."
          />
        </Card>
      </Form>
    </Create>
  );
};
