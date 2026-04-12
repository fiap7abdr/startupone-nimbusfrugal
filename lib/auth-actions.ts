"use server";

import { signIn } from "@/auth";

export async function loginWithGoogle(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  await signIn("google", { redirectTo });
}
