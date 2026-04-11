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
      title="Sair"
      className="flex w-full items-center rounded-md px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-50 justify-center group-hover/sidebar:justify-start group-hover/sidebar:gap-3"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 shrink-0" />
      )}
      <span className="hidden group-hover/sidebar:inline">
        {pending ? "Saindo..." : "Sair"}
      </span>
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
