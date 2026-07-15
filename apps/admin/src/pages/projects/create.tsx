import React, { useMemo, useState } from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { compactSlugToken } from "@thuematbang/contracts";
import { Card, Col, Form, Input, InputNumber, Row, Select, Switch } from "antd";

import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import { AdminLocationField } from "../../components/admin/fields/AdminLocationField";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
import {
  CONTENT_STATUS_OPTIONS,
  PRICE_UNIT_OPTIONS,
} from "../../lib/admin/constants/options";
import { type AdminGalleryImage } from "../../lib/admin/media";

function buildImgs(imgs: AdminGalleryImage[]) {
  return imgs
    .filter((img) => !img.persisted)
    .map((img) => ({
      imageUrl: img.imageUrl,
      imagePublicId: img.imagePublicId,
      width: img.width ?? null,
      height: img.height ?? null,
      bytes: img.bytes ?? null,
    }));
}

export const ProjectsCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();
  const { selectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "PROJECT" }],
  });

  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const form = formProps.form;
  const nameVal = Form.useWatch("name", form);
  const slug = useMemo(
    () => compactSlugToken(String(nameVal ?? "")).slice(0, 120),
    [nameVal]
  );

  const handleFinish = async (values: Record<string, unknown>) => {
    if (imgBusy) {
      setImgErr("Vui lòng đợi ảnh tải xong.");
      return;
    }

    if (images.length < 1) {
      setImgErr("Vui lòng thêm ít nhất một ảnh.");
      return;
    }

    setImgErr(null);
    onFinish?.({
      ...values,
      name: String(values.name ?? ""),
      slug,
      categoryId: Number(values.categoryId),
      provinceId: values.provinceId ? Number(values.provinceId) : undefined,
      wardId: values.wardId ? Number(values.wardId) : undefined,
      area: values.area != null ? Number(values.area) : undefined,
      priceAmount:
        values.priceAmount != null ? Number(values.priceAmount) : undefined,
      price:
        values.priceAmount != null ? Number(values.priceAmount) : undefined,
      priceUnit: values.priceUnit || undefined,
      isNegotiable: Boolean(values.isNegotiable),
      longitude:
        values.longitude != null ? Number(values.longitude) : undefined,
      latitude: values.latitude != null ? Number(values.latitude) : undefined,
      developer: String(values.developer ?? ""),
      addressDetail: String(values.addressDetail ?? ""),
      content: String(values.content ?? ""),
      status: values.status || "DRAFT",
      images: buildImgs(images),
    });
  };

  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Card title="Tổng quan dự án" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên dự án"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true }]}
              >
                <Select {...selectProps} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Slug">
                <Input value={slug} readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chủ đầu tư" name="developer">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Vị trí" style={{ marginBottom: 16 }}>
          <AdminLocationField
            provinceName="provinceId"
            wardName="wardId"
            requiredProvince
          />
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Địa chỉ chi tiết" name="addressDetail">
                <Input.TextArea rows={5} placeholder="Số nhà, tên đường..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Vĩ độ" name="latitude">
                <InputNumber step={0.000001} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Kinh độ" name="longitude">
                <InputNumber step={0.000001} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông tin thương mại" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Diện tích (m²)"
                name="area"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
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
                  <Col span={6}>
                    <Form.Item
                      label="Giá"
                      name="priceAmount"
                      rules={[{ required: true, message: "Nhập giá" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
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
                  <Col span={6}>
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

        <Card title="Nội dung chi tiết" style={{ marginBottom: 16 }}>
          <Form.Item label="Nội dung" name="content" initialValue="">
            <AdminRichTextEditor
              placeholder="Nhập mô tả dự án..."
              imageUpload={{ resourceType: "projects", draftId }}
            />
          </Form.Item>
        </Card>

        <Card title="Xuất bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Trạng thái" name="status" initialValue="DRAFT">
                <Select options={CONTENT_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Hình ảnh">
          <AdminGalleryField
            value={images}
            onChange={setImages}
            error={imgErr}
            onBusyChange={setImgBusy}
            resourceType="projects"
            draftId={draftId}
            maxFiles={25}
          />
        </Card>
      </Form>
    </Create>
  );
};
