import { User } from "../types/user";
import { UserPostingQuota } from "../types/commerce";

const now = "2026-05-13T09:00:00.000Z";

export const mockUsers: User[] = [
  {
    id: 1,
    fullName: "Nguyễn Minh An",
    email: "an.customer@example.com",
    phone: "0909000001",
    role: "CUSTOMER",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    fullName: "Trần Quốc Bảo",
    email: "bao.agent@example.com",
    phone: "0909000002",
    role: "AGENT",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 99,
    fullName: "Admin Thuê Mặt Bằng",
    email: "admin@example.com",
    phone: "0909000099",
    role: "ADMIN",
    createdAt: now,
    updatedAt: now,
  },
];

export const mockUserPostingQuotas: UserPostingQuota[] = [
  {
    id: 1,
    userId: 1,
    freePropertyPostsTotal: 2,
    freePropertyPostsRemaining: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    userId: 2,
    freePropertyPostsTotal: 2,
    freePropertyPostsRemaining: 0,
    createdAt: now,
    updatedAt: now,
  },
];
