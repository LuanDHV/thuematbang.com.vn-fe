import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Select, Card, Input, Switch } from "antd";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
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

function normalizePath(value: unknown) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const withLeadingSlash = text.startsWith("/") ? text : `/${text}`;
  return withLeadingSlash.length > 1
    ? withLeadingSlash.replace(/\/+$/g, "")
    : withLeadingSlash;
}

export const SeoContentsEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const form = formProps.form;
  const draftId = React.useMemo(() => crypto.randomUUID(), []);

  React.useEffect(() => {
    const imageUrl = String(record?.metaImageUrl ?? "");
    const imagePublicId =
      typeof record?.metaImagePublicId === "string"
        ? String(record.metaImagePublicId)
        : null;

    form?.setFieldsValue({
      metaImage:
        imageUrl && imagePublicId
          ? [
              normalizeGalleryImage({
                imageUrl,
                imagePublicId,
                persisted: true,
              }),
            ]
          : [],
    });
  }, [form, record?.metaImagePublicId, record?.metaImageUrl]);

  const handleFinish = async (values: Record<string, unknown>) => {
    const { metaImage, ...rest } = values;
    const selectedImage = Array.isArray(metaImage)
      ? (metaImage[0] as AdminGalleryImage | undefined)
      : undefined;

    onFinish?.({
      ...rest,
      page: String(rest.page ?? ""),
      targetPath: normalizePath(rest.targetPath),
      metaTitle: String(rest.metaTitle ?? ""),
      metaDescription: String(rest.metaDescription ?? ""),
      metaImageUrl: selectedImage?.imageUrl ?? null,
      metaImagePublicId: selectedImage?.imagePublicId ?? null,
      isActive: rest.isActive !== false,
      seoContent: String(rest.seoContent ?? ""),
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
        <Card title="Trang áp dụng" style={{ marginBottom: 16 }}>
          <Form.Item label="Page" name="page" rules={[{ required: true }]}>
            <Select options={PAGE_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="URL áp dụng"
            name="targetPath"
            rules={[{ required: true }]}
          >
            <Input placeholder="cho-thue/van-phong-tp-ho-chi-minh" />
          </Form.Item>
          <Form.Item
            label="Đang hoạt động"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
        <Card title="Metadata" style={{ marginBottom: 16 }}>
          <Form.Item name="metaImage">
            <AdminGalleryField
              label="Ảnh thumbnail SEO"
              description="Ảnh chỉ dùng cho metadata chia sẻ/SEO, không hiển thị ở giao diện public."
              resourceType="seo-contents"
              draftId={draftId}
              resourceId={record?.id != null ? Number(record.id) : undefined}
              maxFiles={1}
              deleteOnRemove={false}
            />
          </Form.Item>
          <Form.Item label="Meta title" name="metaTitle">
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item label="Meta description" name="metaDescription">
            <Input.TextArea maxLength={500} rows={3} showCount />
          </Form.Item>
        </Card>
        <Card title="Nội dung SEO">
          <Form.Item label="Nội dung SEO" name="seoContent">
            <AdminRichTextEditor
              imageUpload={{
                resourceType: "seo-contents",
                draftId,
                resourceId: record?.id != null ? Number(record.id) : undefined,
              }}
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
