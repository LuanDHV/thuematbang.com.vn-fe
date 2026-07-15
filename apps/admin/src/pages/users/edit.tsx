import React, { useState } from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Select, Card, Descriptions, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../providers/auth/auth-client";
import { USER_ROLE_OPTIONS } from "../../lib/admin/constants/options";

const ROLE_TONES: Record<string, string> = { ADMIN: "danger", AGENT: "info", CUSTOMER: "neutral" };
const ROLE_LABELS: Record<string, string> = { ADMIN: "Admin", AGENT: "Môi giới", CUSTOMER: "Khách hàng" };

export const UsersEdit: React.FC = () => {
  const { formProps, query } = useForm();
  const record = query?.data?.data as Record<string, unknown> | undefined;
  const [submitting, setSubmitting] = useState(false);

  if (!record) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const role = formProps.form?.getFieldValue("role");
      await axiosInstance.patch(`/admin/users/${record.id}/role`, { role });
      message.success("Đã cập nhật vai trò.");
    } catch {
      message.error("Không thể cập nhật vai trò.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Edit
      saveButtonProps={{
        onClick: () => { void handleSubmit(); },
        loading: submitting,
        children: "Lưu thay đổi",
      }}
      title={`Chỉnh sửa vai trò #${record.id}`}
    >
      <Card>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar size={80} src={record.avatarUrl as string} icon={<UserOutlined />} />
          <h3 style={{ marginTop: 12, marginBottom: 4 }}>{record.fullName as string}</h3>
          <span
            className={`admin-status-badge admin-status-badge--${
              ROLE_TONES[record.role as string] ?? "neutral"
            }`}
          >
            {ROLE_LABELS[record.role as string] ?? record.role as string}
          </span>
        </div>
        <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Email">{record.email as string}</Descriptions.Item>
          <Descriptions.Item label="SĐT">{(record.phone as string) ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Nhà cung cấp">{record.authProvider as string}</Descriptions.Item>
          <Descriptions.Item label="Có mật khẩu">{record.hasPassword ? "Có" : "Không"}</Descriptions.Item>
        </Descriptions>
        <Form {...formProps} layout="vertical" initialValues={{ role: record.role }}>
          <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
            <Select options={USER_ROLE_OPTIONS} style={{ maxWidth: 300 }} />
          </Form.Item>
        </Form>
      </Card>
    </Edit>
  );
};
