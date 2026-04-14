"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "@/auth";
import { createAuditLog } from "@/lib/audit";

export async function loginWithGoogle(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/app");
  try {
    await signIn("google", { redirectTo });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    await createAuditLog({
      entityType: "user",
      entityId: "unknown",
      action: "login_failure",
      actor: "anonymous",
      actorType: "system",
      module: "auth",
      summary: `Falha no login via google_oauth`,
      metadata: {
        method: "google_oauth",
        reason: error instanceof Error ? error.message : "unknown",
      },
    });
    throw error;
  }
}
