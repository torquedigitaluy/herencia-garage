import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { faseLabel } from "@/lib/fases";
import { ProyectoNuevoForm } from "@/components/admin/ProyectoNuevoForm";
import { ClienteNuevoForm } from "@/components/admin/ClienteNuevoForm";

export const metadata = { title: "Proyectos — Admin · Herencia Garage" };

export default async function ProyectosAdminPage() {
  const supabase = await createClient();

  const [{ data: proyectos, error }, { data: clientes }] = await Promise.all([
    supabase
      .from("proyectos_activos")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, email").eq("role", "cliente").order("email"),
  ]);

  if (error) {
    return <p className="text-metal">Error al cargar proyectos: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-crema">
        Proyectos activos
      </h1>
      <p className="mt-2 text-sm text-metal">
        Cada proyecto es un auto en el taller, asignado a un cliente que sigue el avance
        desde su portal.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6">
          <ProyectoNuevoForm clientes={clientes ?? []} />
          <ClienteNuevoForm />
        </div>

        <div className="lg:col-span-2">
          {!proyectos || proyectos.length === 0 ? (
            <p className="border border-dashed border-metal-oscuro p-10 text-center text-metal">
              No hay proyectos activos todavía.
            </p>
          ) : (
            <ul className="divide-y divide-metal-oscuro border border-metal-oscuro bg-carbon">
              {proyectos.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/proyectos/${p.id}`}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 transition-colors hover:bg-negro"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold uppercase tracking-wide text-crema">
                        {p.vehiculo}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-metal">
                        {p.profiles?.email ?? "cliente sin email"}
                      </p>
                    </div>
                    <span className="border border-metal-oscuro px-2 py-1 font-display text-[10px] uppercase tracking-widest text-metal">
                      {faseLabel(p.fase_actual)}
                    </span>
                    <span className="font-display text-sm font-bold text-amarillo">
                      {p.porcentaje_avance}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-metal" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
