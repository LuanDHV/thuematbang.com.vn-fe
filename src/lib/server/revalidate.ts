import { revalidatePath, revalidateTag } from "next/cache";

export function refreshCrudTags(tags: string[], paths: string[] = []) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  for (const path of paths) {
    revalidatePath(path);
  }
}
