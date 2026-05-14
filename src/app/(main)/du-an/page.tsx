import type { Metadata } from "next";
import ProjectByFilter from "@/components/du-an/ByFilter";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Dự án",
  description: "Cập nhật thông tin dự án bất động sản nổi bật và mới nhất.",
  pathname: "/du-an",
});

export default function DuAnPage() {
  return (
    <>
      <ProjectByFilter />
    </>
  );
}
