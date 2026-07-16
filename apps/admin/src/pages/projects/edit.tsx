import React, { useEffect, useMemo, useState } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { compactSlugToken } from "@thuematbang/contracts";
import { Card, Col, Form, Input, InputNumber, Row, Select, Switch } from "antd";

import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import { AdminLocationField } from "../../components/admin/fields/AdminLocationField";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
import {
  CONTENT_STATUS_OPTIONS,
  PRICE_UNIT_OPTIONS,
} from "../../lib/admin/constants/options";
import {
  normalizeGalleryImage,
  type AdminGalleryImage,
} from "../../lib/admin/media";

function buildImgs(imgs: AdminGalleryImage[]) {
  return imgs
    .filter((img) => !img.persisted)
    .map((img) => ({
      imageUrl: img.imageUrl,
      imagePublicId: img.imagePublicId,
    }));
}

export const ProjectsEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const { selectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "PROJECT" }],
  });

  const rec = query?.data?.data as Record<string, unknown> | undefined;
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const draftId = useMemo(() => crypto.randomUUID(), [rec?.id]);
  const form = formProps.form;
  const nameVal = Form.useWatch("name", form);
  const slug = useMemo(
    () => compactSlugToken(String(nameVal ?? rec?.name ?? "")).slice(0, 120),
    [rec?.name, nameVal]
  );

  useEffect(() => {
    const imgs = rec?.images as Array<Record<string, unknown>> | undefined;
    setImages(
      (imgs ?? [])
        .map((img, i) =>
          normalizeGalleryImage({
            id: typeof img.id === "number" ? img.id : undefined,
            imageUrl: String(img.imageUrl ?? ""),
            imagePublicId:
              typeof img.imagePublicId === "string" ? img.imagePublicId : null,
            width: typeof img.width === "number" ? img.width : null,
            height: typeof img.height === "number" ? img.height : null,
            bytes: typeof img.bytes === "number" ? img.bytes : null,
            sortOrder: typeof img.sortOrder === "number" ? img.sortOrder : i,
          })
        )
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    );
  }, [rec]);

  const handleFinish = async (values: Record<string, unknown>) => {
    if (imgBusy) {
      setImgErr("Vui lòng đợi ảnh tải xong.");
      return;
    }

    if (images.length < 1) {
      setImgErr("Vui lòng thêm ít nhất một ảnh.");
      return;
    }

    const persistedIds = images
      .filter((img) => img.persisted && typeof img.id === "number")
      .map((img) => img.id as number);
    const initIds = (
      (rec?.images as Array<Record<string, unknown>> | undefined) ?? []
    )
      .map((img) => (typeof img.id === "number" ? img.id : null))
      .filter((id): id is number => typeof id === "number");
    const removedIds = initIds.filter((id) => !persistedIds.includes(id));

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
      orderedExistingImageIds: persistedIds,
      removeImageIds: removedIds,
    });
  };

  return (
    <Edit breadcrumb={false} saveButtonProps={saveButtonProps}>
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
                    <Form.Item label="Đơn vị giá" name="priceUnit">
                      <Select options={PRICE_UNIT_OPTIONS} />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
          </Row>
        </Card>

        <Card title="Nội dung chi tiết" style={{ marginBottom: 16 }}>
          <Form.Item label="Nội dung" name="content">
            <AdminRichTextEditor
              placeholder="Nhập mô tả dự án..."
              imageUpload={{
                resourceType: "projects",
                draftId,
                resourceId: rec?.id != null ? Number(rec.id) : undefined,
              }}
            />
          </Form.Item>
        </Card>

        <Card title="Xuất bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Trạng thái" name="status">
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
            resourceId={rec?.id as number | string}
            maxFiles={25}
          />
        </Card>
      </Form>
    </Edit>
  );
};
