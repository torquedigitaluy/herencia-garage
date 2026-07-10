// Detalle de un proyecto del portfolio. Estática con ISR, igual que la Home.
export const revalidate = 60;

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Wrench, SearchCheck, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Placeholder } from "@/components/ui/Placeholder";
import { createPublicClient } from "@/lib/supabase/public";
import type { FotoGaleria, ProyectoPortfolio } from "@/lib/portfolio";

type Props = { params: Promise<{ slug: string }> };

async function getProyecto(slug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("portfolio_publico")
    .select("*, portfolio_fotos(*)")
    .eq("slug", slug)
    .single();
  return data as (ProyectoPortfolio & { portfolio_fotos: FotoGaleria[] }) | null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) return { title: "Proyecto no encontrado · Herencia Garage" };
  return {
    title: `${proyecto.titulo} ${proyecto.anio ?? ""} · Herencia Garage`.replace("  ", " "),
    description: proyecto.descripcion ?? undefined,
  };
}

export default async function ProyectoPage({ params }: Props) {
  const { slug } = await params;
  const proyecto = await getProyecto(slug);
  if (!proyecto) notFound();

  const supabase = createPublicClient();
  const publicUrl = (path: string) =>
    supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;

  const galeria = [...proyecto.portfolio_fotos].sort((a, b) => a.orden - b.orden);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Header del proyecto */}
        <section className="border-b border-metal-oscuro">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
            <Link
              href="/#portfolio"
              className="flex w-fit items-center gap-1.5 font-display text-xs uppercase tracking-widest text-metal transition-colors hover:text-crema"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al portfolio
            </Link>

            <p className="mt-10 flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
              <span className="h-px w-10 bg-amarillo" />
              Proyecto {proyecto.destacado && "destacado"}
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {proyecto.titulo}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-metal">
              {proyecto.anio && (
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amarillo" strokeWidth={1.5} />
                  Modelo {proyecto.anio}
                </span>
              )}
              {proyecto.duracion && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amarillo" strokeWidth={1.5} />
                  {proyecto.duracion} de trabajo
                </span>
              )}
            </div>

            {proyecto.descripcion && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-metal">
                {proyecto.descripcion}
              </p>
            )}
          </div>
        </section>

        {/* Antes & después */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["antes", "despues"] as const).map((momento) => {
              const path =
                momento === "antes" ? proyecto.foto_antes_url : proyecto.foto_despues_url;
              const etiqueta = momento === "antes" ? "Antes" : "Después";
              return (
                <figure key={momento} className="relative">
                  {path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={publicUrl(path)}
                      alt={`${proyecto.titulo} — ${etiqueta.toLowerCase()}`}
                      className="aspect-[4/3] w-full border border-metal-oscuro object-cover"
                    />
                  ) : (
                    <Placeholder label={`${proyecto.titulo} · ${etiqueta}`} ratio="aspect-[4/3]" />
                  )}
                  <figcaption
                    className={`absolute right-3 top-3 border bg-negro/80 px-2 py-1 font-display text-[10px] uppercase tracking-widest ${
                      momento === "antes"
                        ? "border-metal-oscuro text-metal"
                        : "border-amarillo text-amarillo"
                    }`}
                  >
                    {etiqueta}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        {/* Historia de llegada */}
        {proyecto.historia && (
          <section className="border-t border-metal-oscuro">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
              <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
                <span className="h-px w-10 bg-amarillo" />
                Cómo llegó al taller
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-crema/90">
                {proyecto.historia}
              </p>
            </div>
          </section>
        )}

        {/* Problemas y soluciones */}
        {(proyecto.problemas.length > 0 || proyecto.soluciones.length > 0) && (
          <section className="border-t border-metal-oscuro bg-carbon">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-2 lg:py-20">
              {proyecto.problemas.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
                    <SearchCheck className="h-4 w-4 text-amarillo" strokeWidth={1.5} />
                    Qué encontramos
                  </h2>
                  <ol className="mt-8 space-y-5">
                    {proyecto.problemas.map((problema, i) => (
                      <li key={problema} className="flex gap-4">
                        <span className="font-display text-2xl font-bold text-metal-oscuro">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="pt-1 leading-relaxed text-metal">{problema}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {proyecto.soluciones.length > 0 && (
                <div>
                  <h2 className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
                    <Wrench className="h-4 w-4 text-amarillo" strokeWidth={1.5} />
                    Qué hicimos
                  </h2>
                  <ol className="mt-8 space-y-5">
                    {proyecto.soluciones.map((solucion, i) => (
                      <li key={solucion} className="flex gap-4">
                        <span className="font-display text-2xl font-bold text-amarillo">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="pt-1 leading-relaxed text-crema/90">{solucion}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Galería */}
        <section className="border-t border-metal-oscuro">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
            <p className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-metal">
              <span className="h-px w-10 bg-amarillo" />
              Galería del proceso
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galeria.length > 0
                ? galeria.map((foto) => (
                    <figure key={foto.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicUrl(foto.url_foto)}
                        alt={foto.descripcion ?? `${proyecto.titulo} — proceso`}
                        loading="lazy"
                        className="aspect-[4/3] w-full border border-metal-oscuro object-cover"
                      />
                      {foto.descripcion && (
                        <figcaption className="mt-2 text-xs leading-relaxed text-metal">
                          {foto.descripcion}
                        </figcaption>
                      )}
                    </figure>
                  ))
                : [1, 2, 3].map((n) => (
                    <Placeholder key={n} label={`Proceso · Foto ${n}`} ratio="aspect-[4/3]" />
                  ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-metal-oscuro bg-carbon">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-14 lg:py-20">
            <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
              ¿Tenés un clásico esperando su turno?
            </h2>
            <p className="max-w-xl leading-relaxed text-metal">
              Contanos en qué estado está y armamos un plan de restauración a
              medida, como hicimos con este {proyecto.titulo}.
            </p>
            <Link
              href="/#contacto"
              className="border border-amarillo bg-amarillo px-8 py-4 font-display text-sm uppercase tracking-widest text-negro transition-colors hover:border-amarillo-claro hover:bg-amarillo-claro"
            >
              Solicitar cotización
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
