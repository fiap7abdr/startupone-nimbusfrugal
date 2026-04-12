"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";

export async function loginWithGoogle(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  await signIn("google", { redirectTo });
}

export async function loginWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  if (!email) return;
  await signIn("resend", { email, redirectTo });
}

export async function signupWithGoogle(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  await signIn("google", { redirectTo });
}

export async function createAccount(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) return;
  const { name, email } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({ data: { name, email } });
  }

  await signIn("resend", { email, redirectTo });
}
