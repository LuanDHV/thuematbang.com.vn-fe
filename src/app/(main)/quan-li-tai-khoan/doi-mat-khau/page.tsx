import { KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    // Main container with border and padding
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      {/* Title section with icon and heading */}
      <div className="flex items-center gap-2">
        <KeyRound className="text-primary h-5 w-5" />
        <h1 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h1>
      </div>

      {/* Description text with API route info */}
      <p className="mt-2 text-sm text-gray-500">
        Tab này đã sẵn route lồng. Bạn có thể nối form đổi mật khẩu với API
        <code className="ml-1 rounded bg-gray-100 px-1 py-0.5">
          /api/v1/users/me/password
        </code>
        khi cần.
      </p>
    </div>
  );
}
