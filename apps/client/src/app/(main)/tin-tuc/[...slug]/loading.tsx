import { ListingPageSkeleton } from "@/components/common/Skeleton";

export default function DynamicTinTucLoading() {
  return <ListingPageSkeleton variant="news" count={5} />;
}
