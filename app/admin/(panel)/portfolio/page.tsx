import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PortfolioAcciones } from "@/components/admin/PortfolioAcciones";
import { Placeholder } from "@/components/ui/Placeholder";
import type { ProyectoPortfolio } from "@/lib/portfolio";

export const metadata = { title: "Portfolio — Admin · Herencia Garage" };

export default async function PortfolioAdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_publico")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-metal">Error al cargar el portfolio: {error.message}</p>;
  }
  const proyectos = (data ?? []) as ProyectoPortfolio[];

  const publicUrl = (path: string) =>
    supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold uppercase text-crema">Portfolio</h1>
      <p className="mt-2 text-sm text-metal">
        Los trabajos publicados acá aparecen en la sección &ldquo;Antes &amp; después&rdquo;
        de la landing, cada uno con su página propia. Hacé clic en un trabajo
        para editar su historia, problemas, soluciones y galería.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PortfolioForm />
        </div>

        <div className="lg:col-span-2">
          {proyectos.length === 0 ? (
            <p className="border border-dashed border-metal-oscuro p-10 text-center text-metal">
              Todavía no hay trabajos publicados.
            </p>
          ) : (
            <ul className="space-y-4">
              {proyectos.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center gap-4 border border-metal-oscuro bg-carbon p-4"
                >
                  <div className="flex gap-2">
                    {p.foto_antes_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={publicUrl(p.foto_antes_url)}
                        alt={`${p.titulo} antes`}
                        className="h-20 w-28 border border-metal-oscuro object-cover"
                      />
                    ) : (
                      <Placeholder ratio="h-20 w-28" />
                    )}
                    {p.foto_despues_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={publicUrl(p.foto_despues_url)}
                        alt={`${p.titulo} después`}
                        className="h-20 w-28 border border-metal-oscuro object-cover"
                      />
                    ) : (
                      <Placeholder ratio="h-20 w-28" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/portfolio/${p.id}`}
                      className="font-display text-sm font-semibold uppercase tracking-wide text-crema transition-colors hover:text-amarillo"
                    >
                      {p.titulo} {p.anio && <span className="text-metal">{p.anio}</span>}
                    </Link>
                    {p.descripcion && (
                      <p className="mt-1 line-clamp-2 text-sm text-metal">{p.descripcion}</p>
                    )}
                  </div>
                  <Link
                    href={`/admin/portfolio/${p.id}`}
                    title="Editar"
                    className="border border-metal-oscuro p-2 text-metal transition-colors hover:border-amarillo hover:text-amarillo"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <PortfolioAcciones id={p.id} destacado={p.destacado} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
