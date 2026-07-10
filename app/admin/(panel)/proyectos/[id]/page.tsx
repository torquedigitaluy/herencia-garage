import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FaseAvanceForm } from "@/components/admin/FaseAvanceForm";
import { BitacoraForm } from "@/components/admin/BitacoraForm";
import { BitacoraEliminar } from "@/components/admin/BitacoraEliminar";

export const metadata = { title: "Detalle de proyecto — Admin · Herencia Garage" };

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proyecto } = await supabase
    .from("proyectos_activos")
    .select("*, profiles(email), bitacora_fotos(*)")
    .eq("id", id)
    .single();

  if (!proyecto) notFound();

  const bitacora = [...proyecto.bitacora_fotos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  // URLs firmadas para previsualizar las fotos de bitácora
  const fotos = new Map<string, string>();
  for (const entrada of bitacora) {
    const { data } = await supabase.storage
      .from("media")
      .createSignedUrl(entrada.url_foto, 3600);
    if (data?.signedUrl) fotos.set(entrada.id, data.signedUrl);
  }

  return (
    <div>
      <Link
        href="/admin/proyectos"
        className="flex w-fit items-center gap-1.5 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:text-crema"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a proyectos
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase text-crema">
            {proyecto.vehiculo}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-metal">
            <User className="h-4 w-4 text-amarillo" />
            {proyecto.profiles?.email ?? "cliente sin email"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FaseAvanceForm
          proyectoId={proyecto.id}
          faseActual={proyecto.fase_actual}
          porcentaje={proyecto.porcentaje_avance}
        />
        <BitacoraForm proyectoId={proyecto.id} />
      </div>

      <div className="mt-6 border border-metal-oscuro bg-carbon p-6">
        <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
          Bitácora ({bitacora.length})
        </h2>
        {bitacora.length === 0 ? (
          <p className="mt-4 text-sm text-metal">
            Sin actualizaciones todavía. Subí la primera foto del avance.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bitacora.map((entrada) => (
              <li key={entrada.id} className="border border-metal-oscuro bg-negro">
                {fotos.has(entrada.id) && (
                  <a href={fotos.get(entrada.id)} target="_blank">
                    {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal */}
                    <img
                      src={fotos.get(entrada.id)}
                      alt={entrada.descripcion ?? "Foto de bitácora"}
                      className="aspect-[4/3] w-full object-cover transition-opacity hover:opacity-80"
                    />
                  </a>
                )}
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <time className="font-display text-[10px] uppercase tracking-widest text-metal">
                      {new Date(entrada.fecha).toLocaleDateString("es-UY", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    {entrada.descripcion && (
                      <p className="mt-1 text-sm leading-relaxed text-crema">
                        {entrada.descripcion}
                      </p>
                    )}
                  </div>
                  <BitacoraEliminar entradaId={entrada.id} fotoPath={entrada.url_foto} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
