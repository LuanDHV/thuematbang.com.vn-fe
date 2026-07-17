import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Select, Card, Input, Switch } from "antd";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";

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

export const SeoContentsCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();
  const form = formProps.form;

  const handleFinish = async (values: Record<string, unknown>) => {
    onFinish?.({
      ...values,
      page: String(values.page ?? ""),
      targetPath: normalizePath(values.targetPath),
      metaTitle: String(values.metaTitle ?? ""),
      metaDescription: String(values.metaDescription ?? ""),
      isActive: values.isActive !== false,
      seoContent: String(values.seoContent ?? ""),
    });
  };

  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        initialValues={{ isActive: true, seoContent: "" }}
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
                draftId: crypto.randomUUID(),
              }}
            />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
