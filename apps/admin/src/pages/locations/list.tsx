import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../providers/auth/auth-client";

const { Title } = Typography;

interface Province {
  id: number;
  name: string;
  slug: string;
}

interface Ward {
  id: number;
  name: string;
  slug: string;
}

export const LocationsList: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );

  const provincesQuery = useQuery({
    queryKey: ["locations-provinces"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/locations/provinces");
      const items = Array.isArray((data as Record<string, unknown>).data)
        ? ((data as Record<string, unknown>).data as Province[])
        : (data as Province[]);
      return Array.isArray(items) ? items : [];
    },
  });

  const wardsQuery = useQuery({
    queryKey: ["locations-wards", selectedProvince?.id],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const { data } = await axiosInstance.get(
        `/locations/provinces/${selectedProvince.id}/wards`
      );
      const items = Array.isArray((data as Record<string, unknown>).data)
        ? ((data as Record<string, unknown>).data as Ward[])
        : (data as Ward[]);
      return Array.isArray(items) ? items : [];
    },
    enabled: !!selectedProvince,
  });

  return (
    <>
      {selectedProvince ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setSelectedProvince(null)}
            >
              Quay lại tỉnh/thành
            </Button>
          </div>
          <Title level={5}>Phường / Xã — {selectedProvince.name}</Title>
          <Table
            dataSource={wardsQuery.data ?? []}
            rowKey="id"
            loading={wardsQuery.isLoading}
            size="small"
            pagination={{
              showSizeChanger: true,
              showTotal: (t: number) => `${t} kết quả`,
            }}
          >
            <Table.Column title="ID" dataIndex="id" width={80} />
            <Table.Column title="Tên" dataIndex="name" />
            <Table.Column title="Slug" dataIndex="slug" />
          </Table>
        </>
      ) : (
        <>
          <Title level={5}>Tỉnh / Thành phố</Title>
          <Table
            dataSource={provincesQuery.data ?? []}
            rowKey="id"
            loading={provincesQuery.isLoading}
            size="small"
            pagination={{
              showSizeChanger: true,
              showTotal: (t: number) => `${t} kết quả`,
              defaultPageSize: 50,
            }}
          >
            <Table.Column title="ID" dataIndex="id" width={80} />
            <Table.Column
              title="Tên"
              dataIndex="name"
              render={(v: string, row: Province) => (
                <Button type="link" onClick={() => setSelectedProvince(row)}>
                  {v}
                </Button>
              )}
            />
            <Table.Column title="Slug" dataIndex="slug" />
          </Table>
        </>
      )}
    </>
  );
};
