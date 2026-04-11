"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validations";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/app" });
}

export async function loginWithEmail(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;
  await signIn("resend", { email, redirectTo: "/app" });
}

export async function signupWithGoogle() {
  await signIn("google", { redirectTo: "/app" });
}

export async function createAccount(formData: FormData) {
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

  await signIn("resend", { email, redirectTo: "/app" });
}
