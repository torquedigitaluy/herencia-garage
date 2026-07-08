import Link from "next/link";
import { ChevronRight, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EstadoBadge } from "@/components/admin/EstadoBadge";

export const metadata = { title: "Cotizaciones — Admin · Herencia Garage" };

export default async function CotizacionesPage() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase
    .from("leads_cotizacion")
    .select("id, nombre, telefono, vehiculo, estado, fotos_urls, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-metal">Error al cargar los leads: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-crema">
        Solicitudes de cotización
      </h1>
      <p className="mt-2 text-sm text-metal">
        {leads.length} {leads.length === 1 ? "solicitud" : "solicitudes"} en total
      </p>

      {leads.length === 0 ? (
        <p className="mt-10 border border-dashed border-metal-oscuro p-10 text-center text-metal">
          Todavía no llegó ninguna solicitud.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-metal-oscuro border border-metal-oscuro bg-carbon">
          {leads.map((lead) => (
            <li key={lead.id}>
              <Link
                href={`/admin/leads/${lead.id}`}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 transition-colors hover:bg-negro"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold uppercase tracking-wide text-crema">
                    {lead.vehiculo}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-metal">
                    {lead.nombre} · {lead.telefono}
                  </p>
                </div>
                {lead.fotos_urls.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-metal">
                    <ImageIcon className="h-3.5 w-3.5" /> {lead.fotos_urls.length}
                  </span>
                )}
                <span className="text-xs text-metal">
                  {new Date(lead.created_at).toLocaleDateString("es-UY", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <EstadoBadge estado={lead.estado} />
                <ChevronRight className="h-4 w-4 text-metal" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
