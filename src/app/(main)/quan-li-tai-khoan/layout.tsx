import { ReactNode } from "react";
import AccountManagementShell from "@/components/account/AccountManagementShell";

export default function AccountManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AccountManagementShell>{children}</AccountManagementShell>;
}
