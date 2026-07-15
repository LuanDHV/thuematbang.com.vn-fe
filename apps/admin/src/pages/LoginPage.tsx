import React from "react";
import { Form, Input, Button, Typography, App } from "antd";
import {
  AppstoreOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useLogin } from "@refinedev/core";

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const { mutate: login } = useLogin();
  const [loading, setLoading] = React.useState(false);
  const { notification } = App.useApp();

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    login(
      { email: values.email, password: values.password },
      {
        onError: () => {
          notification.error({ message: "Email hoặc mật khẩu không đúng" });
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="login-shell">
      <div className="login-backdrop" aria-hidden="true">
        <div className="login-backdrop__glow login-backdrop__glow--left" />
        <div className="login-backdrop__glow login-backdrop__glow--right" />
        <div className="login-backdrop__glow login-backdrop__glow--bottom" />
        <div className="login-backdrop__grid" />
        <div className="login-backdrop__noise" />
      </div>

      <div className="login-stage">
        <section className="login-surface" aria-label="Biểu mẫu đăng nhập">
          <div className="login-surface__inner">
            <div className="login-brand">
              <div className="login-brand__mark">
                <AppstoreOutlined />
              </div>
              <div className="login-brand__copy">
                <Title level={2} className="login-brand__title">
                  TMB Portal
                </Title>
                <Text className="login-brand__subtitle">
                  Hệ thống quản trị vận hành
                </Text>
              </div>
            </div>

            <Form
              className="login-form"
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
              initialValues={{ email: "", password: "" }}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input
                  className="login-input"
                  prefix={<MailOutlined />}
                  placeholder="Email quản trị"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password
                  className="login-input"
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 10 }}>
                <Button
                  className="login-submit"
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <Text className="login-surface__hint">
              <SafetyCertificateOutlined /> Dành cho quản trị viên và vận hành
              nội bộ.
            </Text>
          </div>
        </section>
      </div>
    </div>
  );
};
