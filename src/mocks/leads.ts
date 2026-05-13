import { Lead } from "../types/lead";
import { mockProperties } from "./properties";

const getProperty = (id: number) =>
  mockProperties.find((property) => property.id === id);

export const mockLeads: Lead[] = [
  {
    id: 1,
    fullName: "Lê Gia Huy",
    phone: "0911222333",
    propertyId: 1001,
    source: "web",
    message: "Cho tôi xin lịch hẹn xem mặt bằng vào chiều thứ 6.",
    status: "NEW",
    createdAt: "2026-05-12T08:00:00.000Z",
    property: getProperty(1001)
      ? { id: 1001, title: getProperty(1001)!.title }
      : null,
  },
  {
    id: 2,
    fullName: "Phạm Đức Long",
    phone: "0933444555",
    propertyId: 1006,
    source: "zalo",
    message: "Kho có hỗ trợ điện 3 pha không?",
    status: "CONTACTED",
    createdAt: "2026-05-11T05:00:00.000Z",
    property: getProperty(1006)
      ? { id: 1006, title: getProperty(1006)!.title }
      : null,
  },
];
