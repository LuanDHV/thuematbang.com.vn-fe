import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Card } from "antd";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";

export const StaticPagesEdit: React.FC = () => {
  const { formProps, saveButtonProps, query, onFinish } = useForm();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const form = formProps.form;

  const handleFinish = async (values: Record<string, unknown>) => {
    onFinish?.({
      ...values,
      siteCode: String(values.siteCode ?? ""),
      content: String(values.content ?? ""),
      isPublished: Boolean(values.isPublished),
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
          <Form.Item
            label="Site Code"
            name="siteCode"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Card>
        <Card title="Nội dung" style={{ marginBottom: 16 }}>
          <Form.Item label="Nội dung" name="content">
            <AdminRichTextEditor
              imageUpload={{
                resourceType: "static-pages",
                draftId: crypto.randomUUID(),
                resourceId: record?.id != null ? Number(record.id) : undefined,
              }}
            />
          </Form.Item>
        </Card>
        <Card title="Hiển thị">
          <Form.Item
            label="Đã xuất bản"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Card>
      </Form>
    </Edit>
  );
};
