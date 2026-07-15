import React, { useEffect, useMemo, useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch, Row, Col, Card } from "antd";
import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import {
  normalizeGalleryImage,
  type AdminGalleryImage,
} from "../../lib/admin/media";

const PAGE_OPTIONS = [
  { label: "Trang chủ", value: "home" },
  { label: "Cho thuê", value: "cho-thue" },
  { label: "Cần thuê", value: "can-thue" },
  { label: "Dự án", value: "du-an" },
  { label: "Tin tức", value: "tin-tuc" },
];
const POS_OPTIONS = [
  { label: "Top", value: "top" },
  { label: "Middle", value: "middle" },
  { label: "Bottom", value: "bottom" },
];

function buildImg(img?: AdminGalleryImage) {
  if (!img) return { imageUrl: null, imagePublicId: null };
  return {
    imageUrl: img.imageUrl,
    imagePublicId: img.imagePublicId,
    width: img.width ?? null,
    height: img.height ?? null,
    bytes: img.bytes ?? null,
  };
}

export const BannersEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const draftId = useMemo(() => crypto.randomUUID(), [record?.id]);
  const form = formProps.form;

  useEffect(() => {
    const url = String(record?.imageUrl ?? "");
    if (!url) return setImages([]);
    setImages([
      normalizeGalleryImage({
        imageUrl: url,
        imagePublicId:
          typeof record?.imagePublicId === "string"
            ? String(record.imagePublicId)
            : null,
      }),
    ]);
  }, [record?.imagePublicId, record?.imageUrl]);

  const handleFinish = async (values: Record<string, unknown>) => {
    if (imgBusy) {
      setImgErr("Vui lòng đợi ảnh tải xong.");
      return;
    }
    if (images.length < 1) {
      setImgErr("Vui lòng thêm ảnh banner.");
      return;
    }
    setImgErr(null);
    onFinish?.({
      ...values,
      title: String(values.title ?? ""),
      targetLink: String(values.targetLink ?? ""),
      page: values.page || "home",
      position: values.position || "top",
      sortOrder: values.sortOrder != null ? Number(values.sortOrder) : 1,
      isActive: Boolean(values.isActive),
      ...buildImg(images[0]),
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
        <Card title="Thông tin banner" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Link đích" name="targetLink">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Trang" name="page">
                <Select options={PAGE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vị trí" name="position">
                <Select options={POS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thứ tự" name="sortOrder">
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Ảnh banner" style={{ marginBottom: 16 }}>
          <AdminGalleryField
            value={images}
            onChange={setImages}
            error={imgErr}
            onBusyChange={setImgBusy}
            resourceType="banners"
            draftId={draftId}
            resourceId={record?.id as number | string}
            maxFiles={1}
          />
        </Card>
        <Card title="Trạng thái">
          <Form.Item label="Hiển thị" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
