import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EstadoSelect } from "@/components/admin/EstadoSelect";

export const metadata = { title: "Detalle de lead — Admin · Herencia Garage" };

export default async function LeadDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead } = await supabase
    .from("leads_cotizacion")
    .select()
    .eq("id", id)
    .single();

  if (!lead) notFound();

  // URLs firmadas (1 h) para ver las fotos del bucket privado
  const fotos: { path: string; url: string }[] = [];
  for (const path of lead.fotos_urls as string[]) {
    const { data } = await supabase.storage.from("media").createSignedUrl(path, 3600);
    if (data?.signedUrl) fotos.push({ path, url: data.signedUrl });
  }

  return (
    <div>
      <Link
        href="/admin"
        className="flex w-fit items-center gap-1.5 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:text-crema"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a cotizaciones
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase text-crema">
            {lead.vehiculo}
          </h1>
          <p className="mt-2 text-sm text-metal">
            Solicitud del{" "}
            {new Date(lead.created_at).toLocaleDateString("es-UY", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <EstadoSelect leadId={lead.id} estadoActual={lead.estado} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 border border-metal-oscuro bg-carbon p-6">
          <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
            Contacto
          </h2>
          <p className="font-display text-lg font-semibold uppercase text-crema">
            {lead.nombre}
          </p>
          <p className="flex items-center gap-2 text-sm text-metal">
            <Phone className="h-4 w-4 text-amarillo" />
            <a
              href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}`}
              target="_blank"
              className="hover:text-crema"
            >
              {lead.telefono}
            </a>
          </p>
          {lead.email && (
            <p className="flex items-center gap-2 text-sm text-metal">
              <Mail className="h-4 w-4 text-amarillo" />
              <a href={`mailto:${lead.email}`} className="hover:text-crema">
                {lead.email}
              </a>
            </p>
          )}
        </div>

        <div className="border border-metal-oscuro bg-carbon p-6 lg:col-span-2">
          <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
            Descripción del trabajo
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-crema">
            {lead.descripcion}
          </p>
        </div>
      </div>

      <div className="mt-6 border border-metal-oscuro bg-carbon p-6">
        <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
          Fotos ({fotos.length})
        </h2>
        {fotos.length === 0 ? (
          <p className="mt-4 text-sm text-metal">El cliente no adjuntó fotos.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {fotos.map((foto) => (
              <a key={foto.path} href={foto.url} target="_blank">
                {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal, no optimizable */}
                <img
                  src={foto.url}
                  alt={`Foto del ${lead.vehiculo}`}
                  className="aspect-[4/3] w-full border border-metal-oscuro object-cover transition-opacity hover:opacity-80"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
