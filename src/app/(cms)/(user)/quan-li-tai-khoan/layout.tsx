import { ReactNode } from "react";
import UserManagementShell from "@/components/cms/user/UserManagementShell";

export default function UserManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <UserManagementShell>{children}</UserManagementShell>;
}
