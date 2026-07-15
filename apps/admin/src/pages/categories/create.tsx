import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Switch, Select, Card } from "antd";

export const CategoriesCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Card>
        <Form {...formProps} layout="vertical">
          <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Loại" name="type" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Tin cho thuê", value: "PROPERTY" },
                { label: "Tin cần thuê", value: "RENT_REQUEST" },
                { label: "Dự án", value: "PROJECT" },
                { label: "Tin tức", value: "NEWS" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Hiển thị"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item label="Loại tin đăng" name="priority" initialValue={1}>
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Card>
    </Create>
  );
};
