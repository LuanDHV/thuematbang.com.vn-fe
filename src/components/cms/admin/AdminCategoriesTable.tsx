import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/types/category";
import type { CategoryType } from "@/types/enums";

type AdminCategoriesTableProps = {
  items: Category[];
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value));
}

function getTypeLabel(type: CategoryType) {
  switch (type) {
    case "PROPERTY":
      return "Cho thuê";
    case "RENT_REQUEST":
      return "Cần thuê";
    case "PROJECT":
      return "Dự án";
    case "NEWS":
      return "Tin tức";
    default:
      return type;
  }
}

function getTypeVariant(type: CategoryType) {
  switch (type) {
    case "PROPERTY":
      return "success";
    case "RENT_REQUEST":
      return "warning";
    case "PROJECT":
      return "default";
    case "NEWS":
      return "secondary";
    default:
      return "outline";
  }
}

function getTypeOrder(type: CategoryType) {
  switch (type) {
    case "PROPERTY":
      return 0;
    case "RENT_REQUEST":
      return 1;
    case "PROJECT":
      return 2;
    case "NEWS":
      return 3;
    default:
      return 99;
  }
}

export default function AdminCategoriesTable({
  items,
}: AdminCategoriesTableProps) {
  const sortedItems = [...items].sort((left, right) => {
    const typeDiff = getTypeOrder(left.type) - getTypeOrder(right.type);
    if (typeDiff !== 0) return typeDiff;
    if (left.priority !== right.priority) return left.priority - right.priority;
    return left.name.localeCompare(right.name, "vi");
  });

  const summary = [
    { type: "PROPERTY" as const, count: items.filter((item) => item.type === "PROPERTY").length },
    {
      type: "RENT_REQUEST" as const,
      count: items.filter((item) => item.type === "RENT_REQUEST").length,
    },
    { type: "PROJECT" as const, count: items.filter((item) => item.type === "PROJECT").length },
    { type: "NEWS" as const, count: items.filter((item) => item.type === "NEWS").length },
  ];

  return (
    <section className="space-y-5">
      <div className="surface-panel overflow-hidden">
        <div className="border-hairline border-b px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-heading text-lg font-semibold tracking-[-0.02em]">
                Danh mục theo type
              </h2>
              <p className="text-secondary mt-1 text-sm">
                Hiển thị đầy đủ tên, slug, độ ưu tiên và trạng thái để admin dễ
                kiểm tra taxonomy.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {summary.map((item) => (
                <Badge key={item.type} variant={getTypeVariant(item.type)}>
                  {getTypeLabel(item.type)}: {item.count}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[26%]">Tên danh mục</TableHead>
              <TableHead className="w-[14%]">Type</TableHead>
              <TableHead className="w-[22%]">Slug</TableHead>
              <TableHead className="w-[10%]">Ưu tiên</TableHead>
              <TableHead className="w-[10%]">Trạng thái</TableHead>
              <TableHead className="w-[9%]">Tạo lúc</TableHead>
              <TableHead className="w-[9%]">Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="align-top">
                    <div className="space-y-1">
                      <p className="text-heading text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-secondary text-xs">ID: {item.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={getTypeVariant(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm">{item.slug}</span>
                  </TableCell>
                  <TableCell className="align-top">
                    <span className="text-body text-sm font-medium">
                      {item.priority}
                    </span>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={item.isActive ? "success" : "muted"}>
                      {item.isActive ? "Đang bật" : "Đã tắt"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {formatDate(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {formatDate(item.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-14 text-center">
                  <div className="space-y-2">
                    <p className="text-heading text-base font-semibold">
                      Không có dữ liệu
                    </p>
                    <p className="text-secondary text-sm">
                      Endpoint categories hiện chưa trả về bản ghi nào.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
