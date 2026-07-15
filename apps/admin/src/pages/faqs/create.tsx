import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, Card } from "antd";

export const FaqsCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();
  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
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
          <Form.Item label="Trang" name="page" initialValue="cho-thue">
            <Input />
          </Form.Item>
          <Form.Item label="Thứ tự" name="sortOrder" initialValue={1}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Card>
    </Create>
  );
};
