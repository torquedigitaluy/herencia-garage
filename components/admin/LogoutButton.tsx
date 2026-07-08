"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ redirectTo = "/admin/login" }: { redirectTo?: string }) {
  const router = useRouter();

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 border border-metal-oscuro px-3 py-2 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:border-rojo hover:text-crema"
    >
      <LogOut className="h-4 w-4" /> Salir
    </button>
  );
}
