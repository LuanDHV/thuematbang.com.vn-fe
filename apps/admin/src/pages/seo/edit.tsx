import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Select, Card } from "antd";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";

const PAGE_OPTIONS = [
  { label: "Trang chủ", value: "home" },
  { label: "Cho thuê", value: "cho-thue" },
  { label: "Cần thuê", value: "can-thue" },
  { label: "Dự án", value: "du-an" },
  { label: "Tin tức", value: "tin-tuc" },
];

export const SeoContentsEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const form = formProps.form;

  const handleFinish = async (values: Record<string, unknown>) => {
    onFinish?.({
      ...values,
      page: String(values.page ?? ""),
      seoContent: String(values.seoContent ?? ""),
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
        </Card>
        <Card title="Nội dung SEO">
          <Form.Item label="Nội dung SEO" name="seoContent">
            <AdminRichTextEditor
              imageUpload={{
                resourceType: "seo-contents",
                draftId: crypto.randomUUID(),
                resourceId: record?.id != null ? Number(record.id) : undefined,
              }}
            />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
