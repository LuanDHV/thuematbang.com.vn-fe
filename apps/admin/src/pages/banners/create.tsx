import React, { useMemo, useState } from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Select, Switch, Row, Col, Card } from "antd";
import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import { type AdminGalleryImage } from "../../lib/admin/media";

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
  };
}

export const BannersCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const draftId = useMemo(() => crypto.randomUUID(), []);
  const form = formProps.form;

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
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
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
                <Input placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Trang" name="page" initialValue="home">
                <Select options={PAGE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Vị trí" name="position" initialValue="top">
                <Select options={POS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Thứ tự" name="sortOrder" initialValue={1}>
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
            maxFiles={1}
          />
        </Card>
        <Card title="Trạng thái">
          <Form.Item
            label="Hiển thị"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
