"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </form>
  );
}
