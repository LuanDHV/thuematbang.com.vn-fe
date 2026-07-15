import { Button, Form } from "antd";
import type { FormInstance } from "antd";
import { ClearOutlined } from "@ant-design/icons";

import { resetAdminSearch } from "../../../lib/admin/utils/table";

function hasValue(value: unknown) {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

type AdminFilterResetButtonProps = {
  form?: FormInstance;
  fields: string[];
  label?: string;
  setFilters?: any;
  setCurrentPage?: (page: number) => void;
};

export function AdminFilterResetButton({
  form: formProp,
  fields,
  label = "Bỏ lọc",
  setFilters,
  setCurrentPage,
}: AdminFilterResetButtonProps) {
  const form = Form.useFormInstance();
  const targetForm = formProp ?? form;

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        fields.some((field) => prevValues?.[field] !== currentValues?.[field])
      }
    >
      {({ getFieldValue }) => {
        const enabled = fields.some((field) => hasValue(getFieldValue(field)));

        return (
          <Button
            htmlType="button"
            icon={<ClearOutlined />}
            disabled={!enabled}
            onClick={() => {
              if (!enabled) {
                return;
              }

              resetAdminSearch(targetForm, setCurrentPage, setFilters);
            }}
          >
            {label}
          </Button>
        );
      }}
    </Form.Item>
  );
}
