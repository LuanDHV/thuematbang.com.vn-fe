import React, { useMemo } from "react";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { compactSlugToken } from "@thuematbang/contracts";
import { Card, Col, Form, Input, InputNumber, Row, Select, Switch } from "antd";

import { AdminLocationField } from "../../components/admin/fields/AdminLocationField";
import { AdminRichTextEditor } from "../../components/admin/fields/AdminRichTextEditor";
import {
  LISTING_STATUS_OPTIONS,
  PRICE_UNIT_OPTIONS,
  PROPERTY_DIRECTION_OPTIONS,
} from "../../lib/admin/constants/options";

export const RentRequestsCreate: React.FC = () => {
  const { formProps, saveButtonProps, onFinish } = useForm();
  const { selectProps: catProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "RENT_REQUEST" }],
  });

  const form = formProps.form;
  const titleValue = Form.useWatch("title", form);
  const generatedSlug = useMemo(
    () => compactSlugToken(String(titleValue ?? "")).slice(0, 120),
    [titleValue]
  );

  const handleFinish = async (values: Record<string, unknown>) => {
    onFinish?.({
      ...values,
      slug: generatedSlug,
      desiredArea:
        values.desiredArea != null ? Number(values.desiredArea) : undefined,
      budgetAmount:
        values.budgetAmount != null ? Number(values.budgetAmount) : undefined,
      budgetUnit: values.budgetUnit || undefined,
      bedrooms: values.bedrooms != null ? Number(values.bedrooms) : undefined,
      bathrooms:
        values.bathrooms != null ? Number(values.bathrooms) : undefined,
      floors: values.floors != null ? Number(values.floors) : undefined,
      desiredDirection: values.desiredDirection || undefined,
      desiredProvinceId: values.desiredProvinceId
        ? Number(values.desiredProvinceId)
        : undefined,
      desiredWardId: values.desiredWardId
        ? Number(values.desiredWardId)
        : undefined,
      isNegotiable: Boolean(values.isNegotiable),
      isExpress: Boolean(values.isExpress),
      isMatched: Boolean(values.isMatched),
      status: values.status || "PENDING",
      duration: values.duration || undefined,
      requirementText: String(values.requirementText ?? ""),
    });
  };

  return (
    <Create breadcrumb={false} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Card title="Liên hệ" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên liên hệ"
                name="contactName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="SĐT"
                name="contactPhone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Thông tin nhu cầu" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: Cần thuê mặt bằng Quận 12" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Slug">
                <Input value={generatedSlug} readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true }]}
              >
                <Select {...catProps} placeholder="Chọn danh mục" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                initialValue="PENDING"
              >
                <Select options={LISTING_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Thương lượng"
                name="isNegotiable"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(pv, cv) => pv.isNegotiable !== cv.isNegotiable}
            >
              {({ getFieldValue }) =>
                getFieldValue("isNegotiable") ? null : (
                  <Col span={9}>
                    <Form.Item
                      label="Ngân sách"
                      name="budgetAmount"
                      rules={[{ required: true, message: "Nhập ngân sách" }]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        formatter={(v) =>
                          `${v ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                      />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(pv, cv) => pv.isNegotiable !== cv.isNegotiable}
            >
              {({ getFieldValue }) =>
                getFieldValue("isNegotiable") ? null : (
                  <Col span={9}>
                    <Form.Item
                      label="Đơn vị"
                      name="budgetUnit"
                      initialValue="MILLION"
                    >
                      <Select
                        placeholder="Chọn đơn vị"
                        options={PRICE_UNIT_OPTIONS}
                      />
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
          </Row>
          <div className="admin-form-grid">
            <Form.Item
              className="admin-form-grid__half"
              label="Diện tích mong muốn (m²)"
              name="desiredArea"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Hướng mong muốn"
              name="desiredDirection"
            >
              <Select allowClear options={PROPERTY_DIRECTION_OPTIONS} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__quarter"
              label="Số phòng ngủ"
              name="bedrooms"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__quarter"
              label="Số phòng tắm"
              name="bathrooms"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              className="admin-form-grid__half"
              label="Số tầng"
              name="floors"
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <AdminLocationField
            provinceName="desiredProvinceId"
            wardName="desiredWardId"
            provinceLabel="Tỉnh/Thành mong muốn"
            wardLabel="Phường/Xã mong muốn"
            requiredProvince
          />
        </Card>

        <Card title="Mô tả nhu cầu" style={{ marginBottom: 16 }}>
          <Form.Item
            label="Mô tả nhu cầu"
            name="requirementText"
            initialValue=""
          >
            <AdminRichTextEditor placeholder="Mô tả chi tiết nhu cầu thuê..." />
          </Form.Item>
        </Card>

        <Card title="Trạng thái & express">
          <div className="admin-setting-row">
            <Form.Item
              label="Express"
              name="isExpress"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Đã khớp nhu cầu"
              name="isMatched"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>
            <Form.Item label="Thời hạn express" name="duration">
              <Select
                allowClear
                options={[
                  { label: "1 ngày", value: "D1" },
                  { label: "3 ngày", value: "D3" },
                  { label: "5 ngày", value: "D5" },
                  { label: "7 ngày", value: "D7" },
                  { label: "14 ngày", value: "D14" },
                  { label: "30 ngày", value: "D30" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item noStyle shouldUpdate={(pv, cv) => pv.status !== cv.status}>
            {({ getFieldValue }) =>
              getFieldValue("status") === "REJECTED" ? (
                <Form.Item
                  label="Lý do từ chối"
                  name="rejectReason"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Card>
      </Form>
    </Create>
  );
};
