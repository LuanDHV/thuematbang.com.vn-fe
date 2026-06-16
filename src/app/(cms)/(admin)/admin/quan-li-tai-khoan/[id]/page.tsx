import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateUserRoleAction } from "@/actions/admin-crud.actions";
import CmsBackLink from "@/components/cms/shared/CmsBackLink";
import CmsFormPageShell from "@/components/cms/shared/CmsFormPageShell";
import { USER_ROLE_OPTIONS } from "@/constants/enum-options";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import { userService } from "@/services/user.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Chỉnh sửa người dùng",
  description: "Cập nhật vai trò người dùng trong CMS Admin.",
  pathname: "/admin/quan-li-tai-khoan",
});

export default async function AdminUserRolePage({ params }: PageProps) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  let user;
  try {
    user = await userService.getAdminUserById(userId);
  } catch {
    notFound();
  }

  return (
    <CmsFormPageShell>
      <div className="space-y-4">
        <CmsBackLink href="/admin/quan-li-tai-khoan" />

        <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <h1 className="text-heading text-lg font-semibold tracking-[-0.02em]">
            Chỉnh sửa vai trò người dùng #{user.id}
          </h1>
          <p className="text-secondary mt-1 text-sm">
            Màn hình này chỉ hỗ trợ đổi vai trò vì BE admin hiện tại chưa cung cấp full CRUD.
          </p>
        </div>

          <form action={updateUserRoleAction.bind(null, user.id)} className="space-y-5 p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-heading text-sm font-medium" htmlFor="role">
                  Vai trò
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={user.role}
                  className="text-body focus-visible:ring-primary/12 focus-visible:border-primary/25 h-11 w-full rounded-lg border border-black/8 bg-white px-3.5 py-2 text-sm transition-all outline-none focus-visible:ring-4"
                >
                  {USER_ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="surface-card p-4">
                <p className="text-secondary text-xs uppercase tracking-[0.18em]">Thông tin</p>
                <p className="text-body mt-2 text-sm">{user.fullName}</p>
                <p className="text-secondary text-xs">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </div>
      </div>
    </CmsFormPageShell>
  );
}
