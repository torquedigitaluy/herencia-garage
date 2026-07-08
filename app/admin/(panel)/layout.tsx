import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, Images, ExternalLink, Wrench } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-negro px-6 text-center">
        <p className="font-display text-2xl font-bold uppercase text-crema">Sin permisos</p>
        <p className="max-w-sm text-sm leading-relaxed text-metal">
          Tu cuenta ({user.email}) no tiene rol de administrador. Pedile acceso al
          responsable del taller.
        </p>
        <LogoutButton />
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-negro">
      <header className="border-b border-metal-oscuro bg-carbon">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-rojo" strokeWidth={1.5} />
            <span className="font-display text-sm font-bold uppercase tracking-wide text-crema">
              Herencia Garage · Admin
            </span>
          </Link>
          <nav className="flex items-center gap-6 font-display text-xs uppercase tracking-widest">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-metal transition-colors hover:text-crema"
            >
              <Inbox className="h-4 w-4" /> Cotizaciones
            </Link>
            <Link
              href="/admin/portfolio"
              className="flex items-center gap-1.5 text-metal transition-colors hover:text-crema"
            >
              <Images className="h-4 w-4" /> Portfolio
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-metal transition-colors hover:text-crema"
            >
              <ExternalLink className="h-4 w-4" /> Ver sitio
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
