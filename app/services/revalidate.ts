"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAllPaths() {
  revalidatePath("/", "layout");
}
