"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { TablePaginationFooter } from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  cn,
  createPaginationChangeHandler,
  formatDateDisplay,
} from "@/lib/utils";
import type { User } from "@/types/user";

type AdminUsersTableProps = {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export default function AdminUsersTable({
  users,
  currentPage,
  totalPages,
  totalItems,
}: AdminUsersTableProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );
  const handlePageChange = createPaginationChangeHandler(
    (href) => router.push(href),
    pathname,
    currentSearch,
    totalPages,
  );

  const handleCopyEmail = async (email?: string | null) => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(email);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <section className="space-y-4">
      <div className="text-secondary text-sm">
        Tổng số người dùng:{" "}
        <span className="text-heading font-semibold">{totalItems}</span>
      </div>

      <div className="surface-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Sao chép</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <p className="text-heading text-sm font-semibold">
                        {user.fullName}
                      </p>
                      <p className="text-secondary text-xs">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <span
                      className={cn(
                        "text-body text-sm",
                        copied === user.email && "text-primary font-medium",
                      )}
                    >
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {user.phone || "—"}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {formatDateDisplay(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right align-top">
                    <button
                      type="button"
                      onClick={() => handleCopyEmail(user.email)}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      {copied === user.email ? "Đã sao chép" : "Copy email"}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-14 text-center">
                  <p className="text-secondary text-sm">
                    Chưa có dữ liệu người dùng.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TablePaginationFooter
            page={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
            colSpan={6}
          />
        </Table>
      </div>
    </section>
  );
}
