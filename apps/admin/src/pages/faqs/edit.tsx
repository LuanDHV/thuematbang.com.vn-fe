import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Card } from "antd";

export const FaqsEdit: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Edit breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Card>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Câu hỏi"
            name="question"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Câu trả lời"
            name="answer"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Trang" name="page">
            <Input />
          </Form.Item>
          <Form.Item label="Thứ tự" name="sortOrder">
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Card>
    </Edit>
  );
};
