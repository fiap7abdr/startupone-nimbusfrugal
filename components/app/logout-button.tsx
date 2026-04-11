"use client";

import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/lib/actions";

function LogoutInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {pending ? "Saindo..." : "Sair"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutInner />
    </form>
  );
}
