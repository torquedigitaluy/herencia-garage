import Link from "next/link";
import { redirect } from "next/navigation";
import { Car, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cliente/login");

  return (
    <div className="min-h-dvh bg-negro">
      <header className="border-b border-metal-oscuro bg-carbon">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/cliente/dashboard" className="flex items-center gap-2">
            <Car className="h-5 w-5 text-amarillo" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold uppercase tracking-wide text-crema">
              Herencia Garage · Mi restauración
            </span>
          </Link>
          <nav className="flex items-center gap-6 font-display text-xs uppercase tracking-widest">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-metal transition-colors hover:text-crema"
            >
              <ExternalLink className="h-4 w-4" /> Ver sitio
            </Link>
            <LogoutButton redirectTo="/cliente/login" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
