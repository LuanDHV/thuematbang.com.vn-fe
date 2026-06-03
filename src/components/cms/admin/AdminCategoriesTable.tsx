import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateDisplay } from "@/lib/utils";
import type { Category } from "@/types/category";

type AdminCategoriesTableProps = {
  items: Category[];
};

export default function AdminCategoriesTable({
  items,
}: AdminCategoriesTableProps) {
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
            {items.length > 0 ? (
              items.map((item) => (
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
                    <Badge variant="outline">{item.type}</Badge>
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
                    <Badge variant="outline">{String(item.isActive)}</Badge>
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {formatDateDisplay(item.createdAt)}
                  </TableCell>
                  <TableCell className="text-body align-top text-sm">
                    {formatDateDisplay(item.updatedAt)}
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
