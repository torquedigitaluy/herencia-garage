import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PortfolioDetalleForm } from "@/components/admin/PortfolioDetalleForm";
import { GaleriaForm } from "@/components/admin/GaleriaForm";
import { GaleriaEliminar } from "@/components/admin/GaleriaEliminar";
import type { FotoGaleria, ProyectoPortfolio } from "@/lib/portfolio";

export const metadata = { title: "Editar proyecto — Admin · Herencia Garage" };

export default async function PortfolioEditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("portfolio_publico")
    .select("*, portfolio_fotos(*)")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const proyecto = data as ProyectoPortfolio & { portfolio_fotos: FotoGaleria[] };

  const galeria = [...proyecto.portfolio_fotos].sort((a, b) => a.orden - b.orden);
  const ordenSiguiente = galeria.length
    ? Math.max(...galeria.map((f) => f.orden)) + 1
    : 0;

  const publicUrl = (path: string) =>
    supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;

  return (
    <div>
      <Link
        href="/admin/portfolio"
        className="flex w-fit items-center gap-1.5 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:text-crema"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al portfolio
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-bold uppercase text-crema">
          {proyecto.titulo} {proyecto.anio && <span className="text-metal">{proyecto.anio}</span>}
        </h1>
        <a
          href={`/portfolio/${proyecto.slug}`}
          target="_blank"
          className="flex items-center gap-1.5 border border-metal-oscuro px-3 py-2 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:border-amarillo hover:text-crema"
        >
          <ExternalLink className="h-4 w-4" /> Ver página pública
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PortfolioDetalleForm proyecto={proyecto} />

        <div className="space-y-6">
          <GaleriaForm proyectoId={proyecto.id} ordenSiguiente={ordenSiguiente} />

          <div className="border border-metal-oscuro bg-carbon p-6">
            <h2 className="font-display text-xs uppercase tracking-[0.35em] text-metal">
              Galería ({galeria.length})
            </h2>
            {galeria.length === 0 ? (
              <p className="mt-4 text-sm text-metal">
                Sin fotos todavía. La página pública muestra placeholders.
              </p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {galeria.map((foto) => (
                  <li key={foto.id} className="border border-metal-oscuro bg-negro">
                    <a href={publicUrl(foto.url_foto)} target="_blank">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicUrl(foto.url_foto)}
                        alt={foto.descripcion ?? "Foto de galería"}
                        className="aspect-[4/3] w-full object-cover transition-opacity hover:opacity-80"
                      />
                    </a>
                    <div className="flex items-start justify-between gap-3 p-3">
                      <p className="text-xs leading-relaxed text-metal">
                        {foto.descripcion ?? "Sin descripción"}
                      </p>
                      <GaleriaEliminar fotoId={foto.id} fotoPath={foto.url_foto} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
