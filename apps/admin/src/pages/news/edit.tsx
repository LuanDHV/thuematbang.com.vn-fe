import React, { useEffect, useMemo, useState } from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { compactSlugToken } from "@thuematbang/contracts";
import { Form, Input, Select, Switch, Row, Col, Card } from "antd";
import { AdminGalleryField } from "../../components/admin/fields/AdminGalleryField";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
import { CONTENT_STATUS_OPTIONS } from "../../lib/admin/constants/options";
import {
  normalizeGalleryImage,
  type AdminGalleryImage,
} from "../../lib/admin/media";

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

export const NewsEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const { selectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "NEWS" }],
  });
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [images, setImages] = useState<AdminGalleryImage[]>([]);
  const [imgErr, setImgErr] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const draftId = useMemo(() => crypto.randomUUID(), [record?.id]);
  const form = formProps.form;
  const titleVal = Form.useWatch("title", form);
  const slug = useMemo(
    () =>
      compactSlugToken(String(titleVal ?? record?.title ?? "")).slice(0, 120),
    [record?.title, titleVal]
  );

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
      setImgErr("Vui lòng thêm thumbnail.");
      return;
    }
    setImgErr(null);
    onFinish?.({
      ...values,
      categoryId: Number(values.categoryId),
      slug,
      summary: String(values.summary ?? ""),
      content: String(values.content ?? ""),
      status: values.status || "DRAFT",
      isFeatured: Boolean(values.isFeatured),
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
        <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true }]}
              >
                <Select {...selectProps} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true }]}
              >
                <Input />
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
              <Form.Item label="Trạng thái" name="status">
                <Select options={CONTENT_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Thumbnail" style={{ marginBottom: 16 }}>
          <AdminGalleryField
            value={images}
            onChange={setImages}
            error={imgErr}
            onBusyChange={setImgBusy}
            resourceType="news"
            draftId={draftId}
            resourceId={record?.id as number | string}
            maxFiles={1}
          />
        </Card>
        <Card title="Nội dung" style={{ marginBottom: 16 }}>
          <Form.Item label="Tóm tắt" name="summary">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Nội dung" name="content">
            <AdminRichTextEditor
              placeholder="Nhập nội dung bài viết..."
              imageUpload={{
                resourceType: "news",
                draftId,
                resourceId: record?.id != null ? Number(record.id) : undefined,
              }}
            />
          </Form.Item>
        </Card>
        <Card title="Hiển thị">
          <Form.Item
            label="Bài nổi bật"
            name="isFeatured"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
